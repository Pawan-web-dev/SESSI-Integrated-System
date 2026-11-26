"""employee dependents

Revision ID: 0004
Revises: 0003
Create Date: 2026-11-25 10:00:00
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = '0004'
down_revision: str | None = '0003'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table('employee_dependents',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('relation', sa.String(length=40), nullable=False),
    sa.Column('cnic', sa.String(length=30), nullable=True),
    sa.Column('date_of_birth', sa.Date(), nullable=True),
    sa.Column('gender', sa.String(length=12), nullable=True),
    sa.Column('photo', sa.Text(), nullable=True),
    sa.Column('source', sa.String(length=10), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], name=op.f('fk_employee_dependents_employee_id_employees'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_employee_dependents'))
    )
    with op.batch_alter_table('employee_dependents', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_employee_dependents_employee_id'), ['employee_id'], unique=False)


def downgrade() -> None:
    with op.batch_alter_table('employee_dependents', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_employee_dependents_employee_id'))
    op.drop_table('employee_dependents')
