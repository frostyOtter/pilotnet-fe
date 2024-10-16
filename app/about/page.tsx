import React from 'react';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const AboutPage = async () => {
  // Read the Markdown file
  const filePath = path.join(process.cwd(), 'app', 'about', 'about-us.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Convert Markdown to HTML
  const contentHtml = marked(fileContent);

  return (
    <div className="container mx-auto px-4 py-8">
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
};

export default AboutPage;