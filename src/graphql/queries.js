/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSubject = /* GraphQL */ `
  query GetSubject($id: ID!) {
    getSubject(id: $id) {
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
export const listSubjects = /* GraphQL */ `
  query ListSubjects(
    $filter: ModelSubjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        en_name
        zh_name
        enable
        image
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
        en_name
        zh_name
        enable
        image
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
        enable
        useful
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBugReport = /* GraphQL */ `
  query GetBugReport($id: ID!) {
    getBugReport(id: $id) {
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
export const listBugReports = /* GraphQL */ `
  query ListBugReports(
    $filter: ModelBugReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBugReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getNewQuestion = /* GraphQL */ `
  query GetNewQuestion($id: ID!) {
    getNewQuestion(id: $id) {
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
export const listNewQuestions = /* GraphQL */ `
  query ListNewQuestions(
    $filter: ModelNewQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNewQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getMaintain = /* GraphQL */ `
  query GetMaintain($id: ID!) {
    getMaintain(id: $id) {
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
export const listMaintains = /* GraphQL */ `
  query ListMaintains(
    $filter: ModelMaintainFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMaintains(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        endDate
        show
        showText
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
