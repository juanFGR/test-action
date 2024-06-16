import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const filePaths = core.getInput('file_paths', { required: true })
    const baseUrl = core.getInput('base_url', { required: true })

    // Set environment variables
    process.env.GITHUB_TOKEN = core.getInput('github_token', { required: true })
    process.env.PERCY_TOKEN = core.getInput('percy_token', { required: true })
    process.env.PUBLIC_BUILDER_API_KEY = core.getInput(
      'public_builder_api_key',
      { required: true }
    )
    process.env.BASE_URL = baseUrl
    process.env.FILE_PATHS = filePaths

    // Checkout
    await exec.exec('git', ['checkout'])

    // Install dependencies
    await exec.exec('npm', ['install'])

    // Install Playwright
    await exec.exec('npx', ['playwright', 'install', '--with-deps', 'chromium'])

    // Run baseline tests
    await exec.exec('bash', [
      '-c',
      `
        export PERCY_BRANCH=baseline-pages;
        export PERCY_TARGET_BRANCH=baseline-pages;
        export BASELINE=true;
        npx percy exec --config ./percy.yml -- playwright test visual-comparison-from-file | tee output.log
      `
    ])

    // Run E2E tests
    await exec.exec('bash', [
      '-c',
      `
        export PERCY_BRANCH=compare-pages;
        export PERCY_TARGET_BRANCH=baseline-pages;
        export BASELINE=false;
        npx percy exec --config ./percy.yml -- playwright test visual-comparison-from-file | tee output.log
      `
    ])

    // Additional steps can be adapted as needed
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
