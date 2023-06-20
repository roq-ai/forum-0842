const mapping: Record<string, string> = {
  comments: 'comment',
  members: 'member',
  organizations: 'organization',
  reactions: 'reaction',
  threads: 'thread',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
