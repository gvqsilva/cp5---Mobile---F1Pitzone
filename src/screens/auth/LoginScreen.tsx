import React, { useState } from 'react';
import { Text, View, Pressable, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { RootStackParamList } from '../../navigation';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import { saveAuthSession, saveProfile } from '../../services/storage';

type Social = { id: string; image?: ImageSourcePropType; icon?: keyof typeof FontAwesome5.glyphMap; color?: string };

const SOCIAL: Social[] = [
  { id: 'google', image: require('../../assets/logos/google.webp') },
  { id: 'microsoft', image: require('../../assets/logos/microsoft.png') },
  { id: 'facebook', icon: 'facebook-f', color: '#1877F2' },
];

export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [manter, setManter] = useState(false);
  const [erro, setErro] = useState('');

  const submit = async () => {
    if (email.trim().toLowerCase() !== 'adm@gmail.com' || senha !== 'adm123') {
      setErro('E-mail ou senha inválidos.');
      return;
    }
    setErro('');
    await saveProfile({ name: 'Administrador', email: 'adm@gmail.com' });
    await saveAuthSession({ email: 'adm@gmail.com', remember: manter, createdAt: new Date().toISOString() });
    navigation.replace('Main');
  };

  return (
    <AuthLayout>
      <Text style={styles.title}>Bem Vindo de volta!</Text>
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Checkbox label="Manter login" checked={manter} onToggle={() => setManter(!manter)} />
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
      <View style={styles.social}>
        {SOCIAL.map((s) => (
          <Pressable key={s.id} style={styles.socialBtn}>
            {s.image ? (
              <Image
                source={s.image}
                style={[styles.socialLogo, s.id === 'google' && styles.googleLogo, s.id === 'microsoft' && styles.microsoftLogo]}
                resizeMode="contain"
              />
            ) : (
              <FontAwesome5 name={s.icon} size={36} color={s.color} />
            )}
          </Pressable>
        ))}
      </View>
      <View style={styles.submit}>
        <Button title="Entrar" onPress={submit} style={{ width: 200 }} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textMuted, fontSize: 20, fontWeight: '700', marginBottom: 22 },
  social: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 34, marginBottom: 24 },
  socialBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  socialLogo: { width: 40, height: 40 },
  googleLogo: { width: 44, height: 44 },
  microsoftLogo: { width: 34, height: 34 },
  erro: { color: colors.red, fontSize: 14, marginTop: 12 },
  submit: { alignItems: 'center', marginTop: 14 },
});
