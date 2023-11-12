/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSubject = /* GraphQL */ `
  query GetSubject($id: ID!) {
    getSubject(id: $id) {
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
export const listSubjects = /* GraphQL */ `
  query ListSubjects(
    $filter: ModelSubjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getSubtitle = /* GraphQL */ `
  query GetSubtitle($id: ID!) {
    getSubtitle(id: $id) {
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
export const listSubtitles = /* GraphQL */ `
  query ListSubtitles(
    $filter: ModelSubtitleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubtitles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
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
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getQuestionReport = /* GraphQL */ `
  query GetQuestionReport($id: ID!) {
    getQuestionReport(id: $id) {
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
export const listQuestionReports = /* GraphQL */ `
  query ListQuestionReports(
    $filter: ModelQuestionReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getOpinion = /* GraphQL */ `
  query GetOpinion($id: ID!) {
    getOpinion(id: $id) {
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
export const listOpinions = /* GraphQL */ `
  query ListOpinions(
    $filter: ModelOpinionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpinions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getNewQuestion = /* GraphQL */ `
  query GetNewQuestion($id: ID!) {
    getNewQuestion(id: $id) {
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
export const listNewQuestions = /* GraphQL */ `
  query ListNewQuestions(
    $filter: ModelNewQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNewQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
