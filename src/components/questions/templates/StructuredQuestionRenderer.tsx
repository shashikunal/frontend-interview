import React from 'react'
import type { Question } from '../../../models/question'
import {
  detectTemplateType,
  parseLeetCodeTemplate,
  parseDomTemplate,
  parseConceptTemplate,
  type TemplateType,
} from '../../../lib/questionTemplate'
import LeetCodeQuestionView from './LeetCodeQuestionView'
import DomBrowserQuestionView from './DomBrowserQuestionView'
import ConceptQuestionView from './ConceptQuestionView'

interface Props {
  question: Question
  showSolutionAccordion?: boolean
  headerActions?: React.ReactNode
  hideHeader?: boolean
}

export default function StructuredQuestionRenderer({
  question,
  showSolutionAccordion = true,
  headerActions,
  hideHeader = false,
}: Props) {
  const templateType: TemplateType = detectTemplateType(question)

  switch (templateType) {
    case 'leetcode': {
      const parsed = parseLeetCodeTemplate(question)
      return (
        <LeetCodeQuestionView
          data={parsed}
          showSolutionAccordion={showSolutionAccordion}
          headerActions={headerActions}
          hideHeader={hideHeader}
        />
      )
    }

    case 'dom-browser': {
      const parsed = parseDomTemplate(question)
      return (
        <DomBrowserQuestionView
          data={parsed}
          showSolutionAccordion={showSolutionAccordion}
          headerActions={headerActions}
          hideHeader={hideHeader}
        />
      )
    }

    case 'concept': {
      const parsed = parseConceptTemplate(question)
      return (
        <ConceptQuestionView
          data={parsed}
          headerActions={headerActions}
          hideHeader={hideHeader}
        />
      )
    }

    case 'machine-coding':
    default:
      // Machine Coding questions remain untouched in their original format
      return null
  }
}
