'use client';

import React, { useState } from 'react';
import MarkdownView from '../common/markdown-viewer';
import { Prompt } from '@/app/types/prompts';
import usePopUp from '@/app/hooks/usePopUp';
import PopUp from '../common/popup';

interface PromptsTableViewProps {
  prompts: Prompt[];
}

export default function PromptsTableView({ prompts }: PromptsTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { popUpCta, popUpDescription, popUpTitle, showPopUp, closePopUp } = usePopUp();

  const onRowClick = (rowData: string[]) => {
    showPopUp(rowData[0], 'What do you want to do', 'View');
  };

  const dataToMarkdownTable = (data: Prompt[]) => {
    const headers =
      '| Prompt ID | Cluster | Content | Created At | Updated At |\n|-----------|---------|---------|------------|------------|';

    const rows = data
      .map(
        (prompt) =>
          `| ${prompt.prompt_id} | ${prompt.metadata.cluster_id} | ${prompt.content} | ${prompt.metadata.created_at} | ${prompt.metadata.updated_at} |`
      )
      .join('\n');

    return `${headers}\n${rows}`;
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.prompt_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.metadata.cluster_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center p-8">
      <div className="w-full flex flex-col gap-8 md:flex-row justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Prompts</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by prompt ID, cluster, or content..."
          className="border border-gray-300 rounded px-4 py-2 mb-6 w-full max-w-md"
        />
      </div>

      <MarkdownView
        content={dataToMarkdownTable(filteredPrompts)}
        onRowClick={onRowClick}
      />

      {popUpTitle && popUpDescription && (
        <PopUp
          title={popUpTitle}
          description={popUpDescription}
          onConfirmCta={popUpCta}
          onClose={closePopUp}
          onConfirm={closePopUp}
        />
      )}
    </div>
  );
}
