import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { Box, Flex, Text, xcss } from '@atlaskit/primitives';
import ProgressBar from '@atlaskit/progress-bar';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';
import Skeleton from '@atlaskit/skeleton';
import TextArea from '@atlaskit/textarea';
import { router, showFlag } from '@forge/bridge';
import { useWeTriggerUrl } from './model/useWeTriggerUrl';

export const App = () => {
  const { weTriggerUrl, isLoading, error, recreate } = useWeTriggerUrl();

  const gotoDocumentation = async () => {
    await router.open('https://kaisersoftapps.github.io/docs/docs/script-master/secured-script-execution');
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(weTriggerUrl ?? '');

    showFlag({
      id: 'success-flag',
      type: 'success',
      title: 'Link Copied!',
      description: 'The URL has been successfully copied to your clipboard',
      isAutoDismiss: true,
    });
  };

  return (
    <Flex
      direction="column"
      gap="space.200"
      xcss={xcss({
        paddingLeft: 'space.100',
        paddingRight: 'space.100',
      })}
    >
      <SectionMessage
        title="Ensuring Secure Script Execution in Forge"
        actions={[
          <SectionMessageAction href="#" onClick={gotoDocumentation}>
            Learn more about configuring secured code execution through an isolated app
          </SectionMessageAction>,
        ]}
      >
        <p>
          Important: This is not a standalone app.
          "Script Master: Sandbox" is a feature within Script Master for Jira and Confluence Cloud and should only be installed if the main app is already installed.
          It cannot be used without the main app.
          The Script Master app allows to run custom scripts on the Forge backend, offering two execution modes:
        </p>
        <ol>
          <li>
            <strong>Unsecured Execution</strong>
            {' (deprecated): '}
            Scripts run directly in the shared Forge backend context. This mode is intended for testing purposes only, as it poses security risks due to shared tenancy. We strongly advise against using this mode.
          </li>
          <li>
            <strong>Secured Execution</strong>
            {': '}
            Scripts are executed securely through this dedicated external app.
            This app isolates script execution from the shared Forge backend context, ensuring robust security.
          </li>
        </ol>
        <p>
          <strong>Affected modules:</strong>
          Web Triggers, Scheduled Jobs, Custom Fields, Workflow Extensions.
        </p>
      </SectionMessage>

      {!!error && (
        <SectionMessage title="Error during secured endpoint creation" appearance="error">
          <p>{error}</p>
        </SectionMessage>
      )}

      <Flex
        direction="column"
        gap="space.100"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          gap="space.100"
        >
          <Box
            xcss={xcss({
              minWidth: '100px',
            })}
          >
            <Text weight="bold" size="large">Token:</Text>
          </Box>
          <Box
            xcss={xcss({
              width: '100%',
            })}
          >
            {isLoading && (
              <ProgressBar ariaLabel="Loading..." isIndeterminate />
            )}
          </Box>
          <Flex
            gap="space.100"
          >
            <DropdownMenu
              trigger={({ triggerRef, ...props }) => (
                <IconButton
                  {...props}
                  label="more"
                  appearance="subtle"
                  icon={MoreIcon}
                  isDisabled={isLoading}
                  ref={triggerRef}
                />
              )}
              label="more"
            >
              <DropdownItemGroup>
                <DropdownItem
                  isDisabled={isLoading}
                  onClick={recreate}
                >
                  Recreate
                </DropdownItem>
              </DropdownItemGroup>
            </DropdownMenu>
            <IconButton
              label="Copy"
              appearance="primary"
              icon={CopyIcon}
              isLoading={isLoading}
              onClick={copyToClipboard}
            />
          </Flex>
        </Flex>

        {!!isLoading && (
          <Skeleton width="100%" height="50px" borderRadius="5px" />
        )}
        {!isLoading && (
          <Flex
            direction="column"
          >
            <TextArea
              isDisabled={true}
              minimumRows={2}
              defaultValue={weTriggerUrl}
            />
            <Text size="small" color="color.text.subtlest">
              Use generated token in Script Master configuration page to use this secured endpoint for code execution
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
