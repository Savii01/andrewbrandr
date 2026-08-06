import { getDriveClient } from "./auth";

export interface CreateClientFolderParams {
    clientName: string;
    packageName: string;
    engagementId: string;
}

export interface ClientFolderResult {
    rootFolderId: string;
    rootFolderUrl: string;
    subFolders: {
        assets: string;
        deliverables: string;
        references: string;
    };
}

/**
 * Creates a structured client folder inside the configured Drive parent:
 *   📁 [ClientName] — [Package] (engagement ID)
 *       📁 Assets
 *       📁 Deliverables
 *       📁 References
 *
 * Returns folder IDs and the shareable URL of the root folder.
 */
export async function createClientFolder(
    params: CreateClientFolderParams
): Promise<ClientFolderResult> {
    const { clientName, packageName, engagementId } = params;
    const drive = getDriveClient();
    const parentId = process.env.GOOGLE_DRIVE_PARENT_ID!;

    // ── 1. Create root client folder ──────────────────────
    const rootFolder = await drive.files.create({
        requestBody: {
            name: `${clientName} — ${packageName}`,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentId],
            description: `Engagement ID: ${engagementId}`,
        },
        fields: "id, webViewLink",
    });

    const rootFolderId = rootFolder.data.id!;
    const rootFolderUrl = rootFolder.data.webViewLink ?? `https://drive.google.com/drive/folders/${rootFolderId}`;

    // ── 2. Create sub-folders in parallel ─────────────────
    const subFolderNames = ["Assets", "Deliverables", "References"] as const;

    const subFolderResults = await Promise.all(
        subFolderNames.map((name) =>
            drive.files.create({
                requestBody: {
                    name,
                    mimeType: "application/vnd.google-apps.folder",
                    parents: [rootFolderId],
                },
                fields: "id",
            })
        )
    );

    const [assetsId, deliverablesId, referencesId] = subFolderResults.map(
        (r) => r.data.id!
    );

    return {
        rootFolderId,
        rootFolderUrl,
        subFolders: {
            assets: assetsId,
            deliverables: deliverablesId,
            references: referencesId,
        },
    };
}
