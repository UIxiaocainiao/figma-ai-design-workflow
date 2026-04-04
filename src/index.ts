const projectName = "figma-ai-design-workflow";

function bootstrap(): void {
  const hasFigmaToken = Boolean(process.env.FIGMA_ACCESS_TOKEN);
  const hasGitHubToken = Boolean(process.env.GITHUB_TOKEN);

  console.log(`${projectName} is ready.`);
  console.log(`FIGMA_ACCESS_TOKEN configured: ${hasFigmaToken}`);
  console.log(`GITHUB_TOKEN configured: ${hasGitHubToken}`);
}

bootstrap();
