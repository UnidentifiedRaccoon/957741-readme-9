export const POST_NOT_FOUND = 'Post not found';
export const POST_NOT_OWNER = 'You are not the owner of this post';
export const REPOST_ALREADY_EXISTS = 'You have already reposted this post';
export const CANNOT_REPOST_OWN = 'You cannot repost your own post';

export const PostApiResponseMessage = {
    PostCreated: 'Post has been created successfully',
    PostFound: 'Post has been found',
    PostUpdated: 'Post has been updated successfully',
    PostDeleted: 'Post has been deleted successfully',
    PostNotFound: 'Post not found',
    PostForbidden: 'You do not have permission to modify this post',
    PostsFound: 'Posts list retrieved',
    RepostCreated: 'Repost has been created successfully',
    RepostExists: 'You have already reposted this post',
    SearchResults: 'Search results retrieved',
  } as const;
  
  