const { execSync } = require('child_process');

try {
  console.log('Removing old variables...');
  try {
    execSync('npx vercel env rm VITE_SUPABASE_URL production -y', { stdio: 'inherit' });
  } catch (e) {}
  try {
    execSync('npx vercel env rm VITE_SUPABASE_ANON_KEY production -y', { stdio: 'inherit' });
  } catch (e) {}

  console.log('Adding fresh variables without newlines...');
  execSync('npx vercel env add VITE_SUPABASE_URL production', { 
    input: 'https://qbarjdthelciemxyihgm.supabase.co',
    stdio: ['pipe', 'inherit', 'inherit']
  });
  
  execSync('npx vercel env add VITE_SUPABASE_ANON_KEY production', { 
    input: 'sb_publishable_uQT-_MM0MjiSuyPbHSa0og_vPzEVuBZ',
    stdio: ['pipe', 'inherit', 'inherit']
  });

  console.log('Deploying again...');
  execSync('npx vercel@latest --prod --yes', { stdio: 'inherit' });

  console.log('Done!');
} catch (error) {
  console.error('Error:', error.message);
}
