"""initial schema

Revision ID: 53e7f4682c7b
Revises: ac4e458d973e
Create Date: 2026-02-12 21:00:30.827403

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '53e7f4682c7b'
down_revision: Union[str, Sequence[str], None] = 'ac4e458d973e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("issues", recreate="always") as batch_op:
        batch_op.drop_constraint("ck_issue_status", type_="check")
        batch_op.create_check_constraint(
            "ck_issue_status",
            "status IN ('TODO', 'DOING', 'CODE REVIEW', 'TESTING', 'DONE')",
        )


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("issues", recreate="always") as batch_op:
        batch_op.drop_constraint("ck_issue_status", type_="check")
        batch_op.create_check_constraint(
            "ck_issue_status",
            "status IN ('TODO', 'DOING', 'QA', 'DONE')",
        )
