import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'public', 'data');

const files = [
  'Controllers.json',
  'Actions.json',
  'Booleans.json',
  'Values_with_types.json',
  'Events.json',
  'custom/EnumValues.json'
];

let globalId = 1;

function processFile(filename) {
  const filePath = path.join(dataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  
  console.log(`Processing ${filename}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.document && data.document.controllers) {
    data.document.controllers.forEach(item => {
      if (!item.prefabid) {
        item.prefabid = globalId++;
        console.log(`  ${item.name} -> prefabid: ${item.prefabid}`);
      }
    });
  } else if (data.document && data.document.actions) {
    data.document.actions.forEach(item => {
      if (!item.prefabid) {
        item.prefabid = globalId++;
        console.log(`  ${item.name} -> prefabid: ${item.prefabid}`);
      }
    });
  } else if (data.document && data.document.booleans) {
    data.document.booleans.forEach(item => {
      if (!item.prefabid) {
        item.prefabid = globalId++;
        console.log(`  ${item.name} -> prefabid: ${item.prefabid}`);
      }
    });
  } else if (data.document && data.document.values) {
    data.document.values.forEach(item => {
      if (!item.prefabid) {
        item.prefabid = globalId++;
        console.log(`  ${item.name} -> prefabid: ${item.prefabid}`);
      }
    });
  } else if (data.document && data.document.events) {
    data.document.events.forEach(item => {
      if (!item.prefabid) {
        item.prefabid = globalId++;
        console.log(`  ${item.name} -> prefabid: ${item.prefabid}`);
      }
    });
  } else if (data.EnumValues) {
    Object.entries(data.EnumValues).forEach(([enumType, items]: [string, any[]]) => {
      items.forEach((item: any) => {
        if (!item.prefabid) {
          item.prefabid = globalId++;
          console.log(`  ${item.name} -> prefabid: ${item.prefabid}`);
        }
      });
    });
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  Saved ${filename}`);
}

function main() {
  console.log('Starting prefab ID assignment...');
  console.log(`Data directory: ${dataDir}`);
  
  files.forEach(processFile);
  
  console.log(`\nTotal prefab IDs assigned: ${globalId - 1}`);
  console.log('Done!');
}

main();
