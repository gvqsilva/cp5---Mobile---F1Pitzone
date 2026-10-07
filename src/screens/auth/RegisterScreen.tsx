import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { RootStackParamList } from '../../navigation';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import { saveAuthSession, saveProfile } from '../../services/storage';
import { firebaseErrorMessage, registerFirebaseUser } from '../../services/firebase';

export default function RegisterScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Register'>) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirma: '' });
  const [aceito, setAceito] = useState(false);
  const [erro, setErro] = useState('');
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.nome || !form.email || !form.senha) return setErro('Preencha nome, e-mail e senha.');
    if (form.senha !== form.confirma) return setErro('As senhas não coincidem.');
    if (!aceito) return setErro('Aceite os termos e condições para continuar.');
    try {
      const user = await registerFirebaseUser(form.nome, form.email, form.senha);
      setErro('');
      await saveProfile({ name: user.displayName ?? form.nome, email: user.email ?? form.email });
      await saveAuthSession({ email: user.email ?? form.email, remember: true, createdAt: new Date().toISOString() });
      navigation.replace('Main');
    } catch (error) {
      setErro(firebaseErrorMessage(error));
    }
  };

  return (
    <AuthLayout>
      <Text style={styles.title}>Bem Vindo!</Text>
      <Input label="Nome" value={form.nome} onChangeText={set('nome')} />
      <Input label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" />
      <Input label="Senha" value={form.senha} onChangeText={set('senha')} secureTextEntry />
      <Input label="Confirme sua senha" value={form.confirma} onChangeText={set('confirma')} secureTextEntry />
      <View style={{ alignItems: 'center', marginTop: 12, gap: 12 }}>
        <Checkbox label="Eu aceito os termos e condições" checked={aceito} onToggle={() => setAceito(!aceito)} />
        {!!erro && <Text style={styles.erro}>{erro}</Text>}
        <Button title="Faça parte" onPress={submit} style={{ width: 200 }} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textMuted, fontSize: 20, fontWeight: '700', marginBottom: 22 },
  erro: { color: colors.red, fontSize: 14 },
});
