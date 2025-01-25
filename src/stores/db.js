
import Dexie from 'dexie';

export const db = new Dexie('projectDatabase');
db.version(1).stores({
  projects: 'id, type, license, authorid, state, view_count, time, title, description, tags, source',
  users: 'id, display_name, motto, images, regTime, sex, username',

});
