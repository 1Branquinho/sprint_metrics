"""initial schema

Revision ID: ac4e458d973e
Revises: 
Create Date: 2026-02-12 20:45:25.473505

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ac4e458d973e'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "collaborators",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_collaborators_id"), "collaborators", ["id"], unique=False)

    op.create_table(
        "sprints",
        sa.Column("sprint_number", sa.Integer(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("work_hours_per_day", sa.Integer(), nullable=False),
        sa.Column("team_size", sa.Integer(), nullable=False),
        sa.Column("max_team_capacity_points", sa.Integer(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("sprint_number"),
    )
    op.create_index(op.f("ix_sprints_sprint_number"), "sprints", ["sprint_number"], unique=False)

    op.create_table(
        "collaborator_capacity",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("sprint_number", sa.Integer(), nullable=False),
        sa.Column("collaborator_id", sa.Integer(), nullable=False),
        sa.Column("min_points", sa.Integer(), nullable=False),
        sa.Column("expected_points", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["collaborator_id"], ["collaborators.id"]),
        sa.ForeignKeyConstraint(["sprint_number"], ["sprints.sprint_number"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("sprint_number", "collaborator_id", name="uq_capacity_sprint_collaborator"),
    )
    op.create_index(op.f("ix_collaborator_capacity_collaborator_id"), "collaborator_capacity", ["collaborator_id"], unique=False)
    op.create_index(op.f("ix_collaborator_capacity_id"), "collaborator_capacity", ["id"], unique=False)
    op.create_index(op.f("ix_collaborator_capacity_sprint_number"), "collaborator_capacity", ["sprint_number"], unique=False)

    op.create_table(
        "issues",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("sprint_number", sa.Integer(), nullable=False),
        sa.Column("issue_number", sa.String(), nullable=False),
        sa.Column("gitlab_url", sa.Text(), nullable=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("story_points", sa.Integer(), nullable=False),
        sa.Column("assignee_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("created_at", sa.Date(), nullable=False),
        sa.Column("work_day", sa.Date(), nullable=False),
        sa.Column("done_at", sa.Date(), nullable=True),
        sa.CheckConstraint("status IN ('TODO', 'DOING', 'CODE REVIEW', 'TESTING', 'DONE')", name="ck_issue_status"),
        sa.ForeignKeyConstraint(["assignee_id"], ["collaborators.id"]),
        sa.ForeignKeyConstraint(["sprint_number"], ["sprints.sprint_number"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_issues_assignee_id"), "issues", ["assignee_id"], unique=False)
    op.create_index(op.f("ix_issues_id"), "issues", ["id"], unique=False)
    op.create_index(op.f("ix_issues_issue_number"), "issues", ["issue_number"], unique=False)
    op.create_index(op.f("ix_issues_sprint_number"), "issues", ["sprint_number"], unique=False)
    op.create_index(op.f("ix_issues_status"), "issues", ["status"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_issues_status"), table_name="issues")
    op.drop_index(op.f("ix_issues_sprint_number"), table_name="issues")
    op.drop_index(op.f("ix_issues_issue_number"), table_name="issues")
    op.drop_index(op.f("ix_issues_id"), table_name="issues")
    op.drop_index(op.f("ix_issues_assignee_id"), table_name="issues")
    op.drop_table("issues")

    op.drop_index(op.f("ix_collaborator_capacity_sprint_number"), table_name="collaborator_capacity")
    op.drop_index(op.f("ix_collaborator_capacity_id"), table_name="collaborator_capacity")
    op.drop_index(op.f("ix_collaborator_capacity_collaborator_id"), table_name="collaborator_capacity")
    op.drop_table("collaborator_capacity")

    op.drop_index(op.f("ix_sprints_sprint_number"), table_name="sprints")
    op.drop_table("sprints")

    op.drop_index(op.f("ix_collaborators_id"), table_name="collaborators")
    op.drop_table("collaborators")
