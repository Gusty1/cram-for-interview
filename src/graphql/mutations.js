/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSubject = /* GraphQL */ `
  mutation CreateSubject(
    $input: CreateSubjectInput!
    $condition: ModelSubjectConditionInput
  ) {
    createSubject(input: $input, condition: $condition) {
      id
      subject
      chineseName
      createDate
      updateDate
      isShow
      remark
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
      subject
      chineseName
      createDate
      updateDate
      isShow
      remark
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
      subject
      chineseName
      createDate
      updateDate
      isShow
      remark
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
      subtitle
      createDate
      updateDate
      isShow
      remark
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
      subtitle
      createDate
      updateDate
      isShow
      remark
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
      subtitle
      createDate
      updateDate
      isShow
      remark
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
      subject
      subtitle
      question
      answer
      clickCount
      createDate
      updateDate
      isShow
      remark
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
      subject
      subtitle
      question
      answer
      clickCount
      createDate
      updateDate
      isShow
      remark
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
      subject
      subtitle
      question
      answer
      clickCount
      createDate
      updateDate
      isShow
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createQuestionReport = /* GraphQL */ `
  mutation CreateQuestionReport(
    $input: CreateQuestionReportInput!
    $condition: ModelQuestionReportConditionInput
  ) {
    createQuestionReport(input: $input, condition: $condition) {
      id
      questionId
      question
      errorMsg
      createDate
      updateDate
      checkResult
      failReason
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateQuestionReport = /* GraphQL */ `
  mutation UpdateQuestionReport(
    $input: UpdateQuestionReportInput!
    $condition: ModelQuestionReportConditionInput
  ) {
    updateQuestionReport(input: $input, condition: $condition) {
      id
      questionId
      question
      errorMsg
      createDate
      updateDate
      checkResult
      failReason
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteQuestionReport = /* GraphQL */ `
  mutation DeleteQuestionReport(
    $input: DeleteQuestionReportInput!
    $condition: ModelQuestionReportConditionInput
  ) {
    deleteQuestionReport(input: $input, condition: $condition) {
      id
      questionId
      question
      errorMsg
      createDate
      updateDate
      checkResult
      failReason
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createOpinion = /* GraphQL */ `
  mutation CreateOpinion(
    $input: CreateOpinionInput!
    $condition: ModelOpinionConditionInput
  ) {
    createOpinion(input: $input, condition: $condition) {
      id
      opinion
      checkResult
      createDate
      updateDate
      failReason
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateOpinion = /* GraphQL */ `
  mutation UpdateOpinion(
    $input: UpdateOpinionInput!
    $condition: ModelOpinionConditionInput
  ) {
    updateOpinion(input: $input, condition: $condition) {
      id
      opinion
      checkResult
      createDate
      updateDate
      failReason
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteOpinion = /* GraphQL */ `
  mutation DeleteOpinion(
    $input: DeleteOpinionInput!
    $condition: ModelOpinionConditionInput
  ) {
    deleteOpinion(input: $input, condition: $condition) {
      id
      opinion
      checkResult
      createDate
      updateDate
      failReason
      remark
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
      subject
      subtitle
      question
      answer
      checkResult
      failReason
      createDate
      updateDate
      remark
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
      subject
      subtitle
      question
      answer
      checkResult
      failReason
      createDate
      updateDate
      remark
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
      subject
      subtitle
      question
      answer
      checkResult
      failReason
      createDate
      updateDate
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`;
