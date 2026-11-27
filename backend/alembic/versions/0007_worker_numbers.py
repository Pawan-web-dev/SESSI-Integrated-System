"""worker numbers: one worker per person (by CNIC) with a permanent ESSI worker number

Creates `workers` and `worker_sequences`, links every employee to a worker and every dependent to a /NN suffix,
and issues numbers to the employees that already exist (year = when the employee was added, Directorate = the
employer's Directorate; the oldest employee first).

Revision ID: 0007
Revises: 0006
Create Date: 2026-11-27 10:00:00
"""
from collections.abc import Sequence
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

from app.services.worker_no import WorkerNoParts, format_worker_no

revision: str = '0007'
down_revision: str | None = '0006'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        'workers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('worker_no', sa.String(length=20), nullable=False),
        sa.Column('cnic', sa.String(length=15), nullable=False),
        sa.Column('directorate_code', sa.String(length=3), nullable=False),
        sa.Column('issued_year', sa.Integer(), nullable=False),
        sa.Column('serial', sa.Integer(), nullable=False),
        sa.Column('issued_by', sa.String(length=80), nullable=False),
        sa.Column('last_member_no', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['directorate_code'], ['directorates.code'], name=op.f('fk_workers_directorate_code_directorates')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_workers')),
        sa.UniqueConstraint('cnic', name=op.f('uq_workers_cnic')),
    )
    op.create_index(op.f('ix_workers_worker_no'), 'workers', ['worker_no'], unique=True)
    op.create_table(
        'worker_sequences',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('directorate_code', sa.String(length=3), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('last_serial', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['directorate_code'], ['directorates.code'], name=op.f('fk_worker_sequences_directorate_code_directorates')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_worker_sequences')),
        sa.UniqueConstraint('directorate_code', 'year', name=op.f('uq_worker_sequences_directorate_code')),
    )
    with op.batch_alter_table('employees', schema=None) as batch_op:
        batch_op.add_column(sa.Column('worker_id', sa.Integer(), nullable=True))
        batch_op.create_index(batch_op.f('ix_employees_worker_id'), ['worker_id'], unique=False)
        batch_op.create_foreign_key(batch_op.f('fk_employees_worker_id_workers'), 'workers', ['worker_id'], ['id'])
    with op.batch_alter_table('employee_dependents', schema=None) as batch_op:
        batch_op.add_column(sa.Column('member_no', sa.Integer(), nullable=True))

    _number_existing()


def _norm(text: str | None) -> str:
    return ''.join(ch for ch in (text or '').lower() if ch.isalnum())


def _number_existing() -> None:
    conn = op.get_bind()
    employees = conn.execute(sa.text(
        'SELECT e.id, e.cnic, e.created_at, r.directorate_code FROM employees e JOIN employers r ON r.id = e.employer_id ORDER BY e.id')).all()
    workers: dict[str, dict] = {}  # cnic -> {'id', 'last_member_no', 'members': [(cnic, name, relation, no)]}
    serials: dict[tuple[str, int], int] = {}
    now = datetime.now(timezone.utc)
    for emp_id, cnic, created_at, directorate in employees:
        w = workers.get(cnic)
        if w is None:
            when = created_at if isinstance(created_at, datetime) else datetime.fromisoformat(str(created_at)) if created_at else now
            year = when.year % 100
            serial = serials.get((directorate, year), 0) + 1
            serials[(directorate, year)] = serial
            worker_no = format_worker_no(WorkerNoParts(year, directorate, serial))
            worker_id = conn.execute(sa.text(
                'INSERT INTO workers (worker_no, cnic, directorate_code, issued_year, serial, issued_by, last_member_no, created_at) '
                "VALUES (:no, :cnic, :d, :y, :s, 'migration', 0, :now) RETURNING id"),
                {'no': worker_no, 'cnic': cnic, 'd': directorate, 'y': year, 's': serial, 'now': now}).scalar_one()
            w = workers[cnic] = {'id': worker_id, 'last_member_no': 0, 'members': []}
        conn.execute(sa.text('UPDATE employees SET worker_id = :w WHERE id = :e'), {'w': w['id'], 'e': emp_id})

        for dep_id, dcnic, name, relation in conn.execute(sa.text(
                'SELECT id, cnic, name, relation FROM employee_dependents WHERE employee_id = :e ORDER BY id'), {'e': emp_id}).all():
            same = next((no for c, n, r, no in w['members'] if (_norm(dcnic) and _norm(c) == _norm(dcnic))
                         or (_norm(n) == _norm(name) and _norm(r) == _norm(relation))), None)
            if same is None:
                w['last_member_no'] += 1
                same = w['last_member_no']
            w['members'].append((dcnic, name, relation, same))
            conn.execute(sa.text('UPDATE employee_dependents SET member_no = :n WHERE id = :d'), {'n': same, 'd': dep_id})

    for w in workers.values():
        conn.execute(sa.text('UPDATE workers SET last_member_no = :n WHERE id = :w'), {'n': w['last_member_no'], 'w': w['id']})
    for (directorate, year), serial in serials.items():
        conn.execute(sa.text('INSERT INTO worker_sequences (directorate_code, year, last_serial) VALUES (:d, :y, :s)'),
                     {'d': directorate, 'y': year, 's': serial})


def downgrade() -> None:
    with op.batch_alter_table('employee_dependents', schema=None) as batch_op:
        batch_op.drop_column('member_no')
    with op.batch_alter_table('employees', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_employees_worker_id_workers'), type_='foreignkey')
        batch_op.drop_index(batch_op.f('ix_employees_worker_id'))
        batch_op.drop_column('worker_id')
    op.drop_table('worker_sequences')
    op.drop_index(op.f('ix_workers_worker_no'), table_name='workers')
    op.drop_table('workers')
