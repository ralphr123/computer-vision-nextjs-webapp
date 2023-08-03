import {
  AccountSASPermissions,
  AccountSASResourceTypes,
  AccountSASServices,
  generateAccountSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

export const generateAzureStorageSasToken = async (): Promise<{
  sasToken?: string;
  storageUri: string;
}> => {
  const {
    AZURE_STORAGE_ACCOUNT_NAME: accountName,
    AZURE_STORAGE_ACCOUNT_KEY: accountKey,
    AZURE_STORAGE_CONTAINER_NAME: containerName,
  } = process.env;

  const storageUri = `https://${accountName}.blob.core.windows.net/${containerName}`;

  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const sasOptions = {
      services: AccountSASServices.parse('btqf').toString(), // blobs, tables, queues, files
      resourceTypes: AccountSASResourceTypes.parse('sco').toString(), // service, container, object
      permissions: AccountSASPermissions.parse('rwdlacupi'), // permissions
      protocol: SASProtocol.Https,
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 40 * 60 * 1000), // 40 minutes
    };

    const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

    return {
      storageUri,
      sasToken: sasToken[0] === '?' ? sasToken : `?${sasToken}`,
    };
  } catch (error) {
    console.error(`Failed to generate SAS token: ${error}`);
    return {
      storageUri,
    };
  }
};
