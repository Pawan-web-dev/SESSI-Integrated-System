"""partner keys: API keys for pharmacy and hospital (HMIS) systems that check a worker's eligibility

Revision ID: 0008
Revises: 0007
Create Date: 2026-11-27 14:00:00
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = '0008'
down_revision: str | None = '0007'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        'partner_keys',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('kind', sa.String(length=20), nullable=False),
        sa.Column('key_prefix', sa.String(length=16), nullable=False),
        sa.Column('key_hash', sa.String(length=64), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False),
        sa.Column('created_by', sa.String(length=80), nullable=False),
        sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('revoked_by', sa.String(length=80), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_partner_keys')),
    )
    op.create_index(op.f('ix_partner_keys_key_hash'), 'partner_keys', ['key_hash'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_partner_keys_key_hash'), table_name='partner_keys')
    op.drop_table('partner_keys')
