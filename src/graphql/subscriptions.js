/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSubject = /* GraphQL */ `
  subscription OnCreateSubject($filter: ModelSubscriptionSubjectFilterInput) {
    onCreateSubject(filter: $filter) {
      id
      en_name
      zh_name
      enable
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateSubject = /* GraphQL */ `
  subscription OnUpdateSubject($filter: ModelSubscriptionSubjectFilterInput) {
    onUpdateSubject(filter: $filter) {
      id
      en_name
      zh_name
      enable
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteSubject = /* GraphQL */ `
  subscription OnDeleteSubject($filter: ModelSubscriptionSubjectFilterInput) {
    onDeleteSubject(filter: $filter) {
      id
      en_name
      zh_name
      enable
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateSubtitle = /* GraphQL */ `
  subscription OnCreateSubtitle($filter: ModelSubscriptionSubtitleFilterInput) {
    onCreateSubtitle(filter: $filter) {
      id
      subject
      en_name
      zh_name
      enable
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateSubtitle = /* GraphQL */ `
  subscription OnUpdateSubtitle($filter: ModelSubscriptionSubtitleFilterInput) {
    onUpdateSubtitle(filter: $filter) {
      id
      subject
      en_name
      zh_name
      enable
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteSubtitle = /* GraphQL */ `
  subscription OnDeleteSubtitle($filter: ModelSubscriptionSubtitleFilterInput) {
    onDeleteSubtitle(filter: $filter) {
      id
      subject
      en_name
      zh_name
      enable
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onCreateQuestion(filter: $filter) {
      id
      subtitle
      question
      answer
      enable
      useful
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onUpdateQuestion(filter: $filter) {
      id
      subtitle
      question
      answer
      enable
      useful
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onDeleteQuestion(filter: $filter) {
      id
      subtitle
      question
      answer
      enable
      useful
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateBugReport = /* GraphQL */ `
  subscription OnCreateBugReport(
    $filter: ModelSubscriptionBugReportFilterInput
  ) {
    onCreateBugReport(filter: $filter) {
      id
      questionID
      email
      fixContent
      status
      result
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBugReport = /* GraphQL */ `
  subscription OnUpdateBugReport(
    $filter: ModelSubscriptionBugReportFilterInput
  ) {
    onUpdateBugReport(filter: $filter) {
      id
      questionID
      email
      fixContent
      status
      result
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBugReport = /* GraphQL */ `
  subscription OnDeleteBugReport(
    $filter: ModelSubscriptionBugReportFilterInput
  ) {
    onDeleteBugReport(filter: $filter) {
      id
      questionID
      email
      fixContent
      status
      result
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMaintain = /* GraphQL */ `
  subscription OnCreateMaintain($filter: ModelSubscriptionMaintainFilterInput) {
    onCreateMaintain(filter: $filter) {
      id
      finishDate
      showText
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMaintain = /* GraphQL */ `
  subscription OnUpdateMaintain($filter: ModelSubscriptionMaintainFilterInput) {
    onUpdateMaintain(filter: $filter) {
      id
      finishDate
      showText
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMaintain = /* GraphQL */ `
  subscription OnDeleteMaintain($filter: ModelSubscriptionMaintainFilterInput) {
    onDeleteMaintain(filter: $filter) {
      id
      finishDate
      showText
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
