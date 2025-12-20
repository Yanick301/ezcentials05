#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion à Supabase
 * Utilisation: node scripts/test-supabase-connection.js
 */

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Test de connexion à Supabase...\n');

// Vérifier les variables d'environnement
if (!supabaseUrl) {
  console.error('❌ ERREUR: NEXT_PUBLIC_SUPABASE_URL n\'est pas défini');
  console.log('💡 Solution: Vérifiez votre fichier .env.local');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ ERREUR: NEXT_PUBLIC_SUPABASE_ANON_KEY n\'est pas défini');
  console.log('💡 Solution: Vérifiez votre fichier .env.local');
  process.exit(1);
}

console.log('✅ Variables d\'environnement trouvées');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

// Tester la connexion
async function testConnection() {
  try {
    // Import dynamique de @supabase/supabase-js
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔄 Test de connexion à la base de données...');

    // Tester une requête simple
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (error) {
      // Si l'erreur est "relation does not exist", c'est que les tables n'ont pas été créées
      if (error.message.includes('does not exist') || error.code === 'PGRST116') {
        console.error('❌ ERREUR: Les tables n\'existent pas encore');
        console.log('💡 Solution: Exécutez le script SQL dans supabase/schema.sql');
        console.log('   Allez dans Supabase > SQL Editor > New query > Collez schema.sql > Run');
        process.exit(1);
      } else if (error.message.includes('permission denied') || error.code === '42501') {
        console.error('❌ ERREUR: Permissions insuffisantes');
        console.log('💡 Solution: Exécutez le script RLS dans supabase/rls.sql');
        console.log('   Allez dans Supabase > SQL Editor > New query > Collez rls.sql > Run');
        process.exit(1);
      } else {
        console.error('❌ ERREUR:', error.message);
        process.exit(1);
      }
    }

    console.log('✅ Connexion réussie !');
    console.log('✅ Les tables existent');
    console.log('✅ Les permissions sont correctes\n');
    console.log('🎉 Votre configuration Supabase est correcte !\n');

    // Tester l'authentification
    console.log('🔄 Test de l\'authentification...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError && !authError.message.includes('No session')) {
      console.warn('⚠️  Avertissement:', authError.message);
    } else {
      console.log('✅ Service d\'authentification accessible\n');
    }

    console.log('✨ Tous les tests sont passés !');
    console.log('🚀 Vous pouvez maintenant utiliser Supabase dans votre application\n');

  } catch (err) {
    console.error('❌ ERREUR lors du test:', err.message);
    if (err.message.includes('Cannot find module')) {
      console.log('💡 Solution: Installez les dépendances avec: npm install');
    }
    process.exit(1);
  }
}

testConnection();






































