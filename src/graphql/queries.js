/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSubject = /* GraphQL */ `
  query GetSubject($id: ID!) {
    getSubject(id: $id) {
      id
      subject
      subject_zh
      show
      createDate
      updateDate
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`
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
        subject_zh
        show
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
`
export const getSubtitle = /* GraphQL */ `
  query GetSubtitle($id: ID!) {
    getSubtitle(id: $id) {
      id
      subject
      subtitle
      count
      show
      createDate
      updateDate
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`
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
        count
        show
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
`
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      subtitle
      question
      answer
      count
      show
      order
      createDate
      updateDate
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        subtitle
        question
        answer
        count
        show
        order
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
`
export const getReport = /* GraphQL */ `
  query GetReport($id: ID!) {
    getReport(id: $id) {
      id
      questionId
      errorMsg
      state
      result
      reason
      createDate
      updateDate
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`
export const listReports = /* GraphQL */ `
  query ListReports(
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        questionId
        errorMsg
        state
        result
        reason
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
`
export const getOpinion = /* GraphQL */ `
  query GetOpinion($id: ID!) {
    getOpinion(id: $id) {
      id
      opinion
      state
      result
      reason
      createDate
      updateDate
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`
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
        state
        result
        reason
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
`
export const getNewQuestion = /* GraphQL */ `
  query GetNewQuestion($id: ID!) {
    getNewQuestion(id: $id) {
      id
      subject
      subtitle
      question
      answer
      state
      result
      reason
      createDate
      updateDate
      remark
      createdAt
      updatedAt
      __typename
    }
  }
`
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
        state
        result
        reason
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
`
