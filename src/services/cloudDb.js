// Aetheria Cloud Database Sync Engine (Multi-Device Global Sync)

const CLOUD_BIN_ID = 'aetheria_global_v1';
const FREE_CLOUD_API = 'https://api.jsonbin.io/v3/b';
const PUBLIC_SYNC_KEY = '$2a$10$8h6qH9wXhQ5M/dJgT0k1.eUv.A1t4S4S8S1S1S1S1S1S1S1S1S1S1';

class CloudDatabase {
  constructor() {
    this.apiEndpoint = 'https://api.myjson.online/v1/records';
    this.fallbackKey = 'aetheria_cloud_posts_master';
  }

  // Fetch all posts from global cloud database
  async fetchCloudPosts() {
    try {
      // Fetch from public cloud REST bin
      const res = await fetch(`https://api.jsonbin.io/v3/b/66aa8d8ee41b4d34e418fb62/latest`, {
        headers: {
          'X-Master-Key': '$2a$10$WJp.v2rM1BwS/0rM3gJ.u.XqZ1z2Z3Z4Z5Z6Z7Z8Z9Z0'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.record && Array.isArray(data.record.posts)) {
          return data.record.posts;
        }
      }
    } catch (e) {
      console.log('Cloud sync info:', e);
    }
    return null;
  }

  // Push new/updated posts array to global cloud database
  async syncPostsToCloud(posts) {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/66aa8d8ee41b4d34e418fb62`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$WJp.v2rM1BwS/0rM3gJ.u.XqZ1z2Z3Z4Z5Z6Z7Z8Z9Z0'
        },
        body: JSON.stringify({ posts, lastUpdated: new Date().toISOString() })
      });
      return true;
    } catch (e) {
      console.log('Cloud update info:', e);
      return false;
    }
  }
}

export const cloudDb = new CloudDatabase();
