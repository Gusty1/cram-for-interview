/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSubject = /* GraphQL */ `
  subscription OnCreateSubject($filter: ModelSubscriptionSubjectFilterInput) {
    onCreateSubject(filter: $filter) {
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
export const onUpdateSubject = /* GraphQL */ `
  subscription OnUpdateSubject($filter: ModelSubscriptionSubjectFilterInput) {
    onUpdateSubject(filter: $filter) {
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
export const onDeleteSubject = /* GraphQL */ `
  subscription OnDeleteSubject($filter: ModelSubscriptionSubjectFilterInput) {
    onDeleteSubject(filter: $filter) {
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
export const onCreateSubtitle = /* GraphQL */ `
  subscription OnCreateSubtitle($filter: ModelSubscriptionSubtitleFilterInput) {
    onCreateSubtitle(filter: $filter) {
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
export const onUpdateSubtitle = /* GraphQL */ `
  subscription OnUpdateSubtitle($filter: ModelSubscriptionSubtitleFilterInput) {
    onUpdateSubtitle(filter: $filter) {
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
export const onDeleteSubtitle = /* GraphQL */ `
  subscription OnDeleteSubtitle($filter: ModelSubscriptionSubtitleFilterInput) {
    onDeleteSubtitle(filter: $filter) {
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
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onCreateQuestion(filter: $filter) {
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
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onUpdateQuestion(filter: $filter) {
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
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onDeleteQuestion(filter: $filter) {
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
export const onCreateReport = /* GraphQL */ `
  subscription OnCreateReport($filter: ModelSubscriptionReportFilterInput) {
    onCreateReport(filter: $filter) {
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
export const onUpdateReport = /* GraphQL */ `
  subscription OnUpdateReport($filter: ModelSubscriptionReportFilterInput) {
    onUpdateReport(filter: $filter) {
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
export const onDeleteReport = /* GraphQL */ `
  subscription OnDeleteReport($filter: ModelSubscriptionReportFilterInput) {
    onDeleteReport(filter: $filter) {
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
export const onCreateOpinion = /* GraphQL */ `
  subscription OnCreateOpinion($filter: ModelSubscriptionOpinionFilterInput) {
    onCreateOpinion(filter: $filter) {
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
export const onUpdateOpinion = /* GraphQL */ `
  subscription OnUpdateOpinion($filter: ModelSubscriptionOpinionFilterInput) {
    onUpdateOpinion(filter: $filter) {
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
export const onDeleteOpinion = /* GraphQL */ `
  subscription OnDeleteOpinion($filter: ModelSubscriptionOpinionFilterInput) {
    onDeleteOpinion(filter: $filter) {
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
export const onCreateNewQuestion = /* GraphQL */ `
  subscription OnCreateNewQuestion(
    $filter: ModelSubscriptionNewQuestionFilterInput
  ) {
    onCreateNewQuestion(filter: $filter) {
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
export const onUpdateNewQuestion = /* GraphQL */ `
  subscription OnUpdateNewQuestion(
    $filter: ModelSubscriptionNewQuestionFilterInput
  ) {
    onUpdateNewQuestion(filter: $filter) {
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
export const onDeleteNewQuestion = /* GraphQL */ `
  subscription OnDeleteNewQuestion(
    $filter: ModelSubscriptionNewQuestionFilterInput
  ) {
    onDeleteNewQuestion(filter: $filter) {
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
