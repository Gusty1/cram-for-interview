/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSubject = /* GraphQL */ `
  mutation CreateSubject(
    $input: CreateSubjectInput!
    $condition: ModelSubjectConditionInput
  ) {
    createSubject(input: $input, condition: $condition) {
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
export const updateSubject = /* GraphQL */ `
  mutation UpdateSubject(
    $input: UpdateSubjectInput!
    $condition: ModelSubjectConditionInput
  ) {
    updateSubject(input: $input, condition: $condition) {
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
export const deleteSubject = /* GraphQL */ `
  mutation DeleteSubject(
    $input: DeleteSubjectInput!
    $condition: ModelSubjectConditionInput
  ) {
    deleteSubject(input: $input, condition: $condition) {
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
export const createSubtitle = /* GraphQL */ `
  mutation CreateSubtitle(
    $input: CreateSubtitleInput!
    $condition: ModelSubtitleConditionInput
  ) {
    createSubtitle(input: $input, condition: $condition) {
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
export const updateSubtitle = /* GraphQL */ `
  mutation UpdateSubtitle(
    $input: UpdateSubtitleInput!
    $condition: ModelSubtitleConditionInput
  ) {
    updateSubtitle(input: $input, condition: $condition) {
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
export const deleteSubtitle = /* GraphQL */ `
  mutation DeleteSubtitle(
    $input: DeleteSubtitleInput!
    $condition: ModelSubtitleConditionInput
  ) {
    deleteSubtitle(input: $input, condition: $condition) {
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
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
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
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
export const createBugReport = /* GraphQL */ `
  mutation CreateBugReport(
    $input: CreateBugReportInput!
    $condition: ModelBugReportConditionInput
  ) {
    createBugReport(input: $input, condition: $condition) {
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
export const updateBugReport = /* GraphQL */ `
  mutation UpdateBugReport(
    $input: UpdateBugReportInput!
    $condition: ModelBugReportConditionInput
  ) {
    updateBugReport(input: $input, condition: $condition) {
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
export const deleteBugReport = /* GraphQL */ `
  mutation DeleteBugReport(
    $input: DeleteBugReportInput!
    $condition: ModelBugReportConditionInput
  ) {
    deleteBugReport(input: $input, condition: $condition) {
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
export const createNewQuestion = /* GraphQL */ `
  mutation CreateNewQuestion(
    $input: CreateNewQuestionInput!
    $condition: ModelNewQuestionConditionInput
  ) {
    createNewQuestion(input: $input, condition: $condition) {
      id
      username
      email
      subject
      subtitle
      question
      answer
      images
      status
      result
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateNewQuestion = /* GraphQL */ `
  mutation UpdateNewQuestion(
    $input: UpdateNewQuestionInput!
    $condition: ModelNewQuestionConditionInput
  ) {
    updateNewQuestion(input: $input, condition: $condition) {
      id
      username
      email
      subject
      subtitle
      question
      answer
      images
      status
      result
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteNewQuestion = /* GraphQL */ `
  mutation DeleteNewQuestion(
    $input: DeleteNewQuestionInput!
    $condition: ModelNewQuestionConditionInput
  ) {
    deleteNewQuestion(input: $input, condition: $condition) {
      id
      username
      email
      subject
      subtitle
      question
      answer
      images
      status
      result
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createMaintain = /* GraphQL */ `
  mutation CreateMaintain(
    $input: CreateMaintainInput!
    $condition: ModelMaintainConditionInput
  ) {
    createMaintain(input: $input, condition: $condition) {
      id
      endDate
      show
      showText
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateMaintain = /* GraphQL */ `
  mutation UpdateMaintain(
    $input: UpdateMaintainInput!
    $condition: ModelMaintainConditionInput
  ) {
    updateMaintain(input: $input, condition: $condition) {
      id
      endDate
      show
      showText
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteMaintain = /* GraphQL */ `
  mutation DeleteMaintain(
    $input: DeleteMaintainInput!
    $condition: ModelMaintainConditionInput
  ) {
    deleteMaintain(input: $input, condition: $condition) {
      id
      endDate
      show
      showText
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
