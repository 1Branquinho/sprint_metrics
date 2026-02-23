from app.core.enums import IssueStatus

def test_enum_values():
    assert IssueStatus.DONE == "DONE"
    assert IssueStatus.TODO == "TODO"