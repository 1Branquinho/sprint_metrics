from enum import StrEnum

class IssueStatus(StrEnum):
    TODO = "TODO"
    DOING = "DOING"
    CODE_REVIEW = "CODE REVIEW"
    TESTING = "TESTING"
    DONE = "DONE"
