export interface StoryMetadata {
    storyMetadataVersion: number,
    id: string,
    remoteId: string,
    remoteStoryId: string,
    title: string,
    description: string,
    textPreview: string,
    favorite: boolean,
    tags: any[],
    createdAt: number,
    lateUpdatedAt: number,
    isModified: boolean
}