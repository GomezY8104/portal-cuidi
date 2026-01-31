import React, { useState } from 'react';
import { PageHeader } from 'react-native-paper';
import { FileText, Lock } from 'react-native-vector-icons';
import { View, Text, StyleSheet } from 'react-native';

const TermsAndPrivacyScreen = ({ navigation }) => {
  const [type, setType] = useState('terms'); // 'terms' ou 'privacy'

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  return (
    <View style={styles.container}>
      <PageHeader 
        title={type === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'} 
        subtitle={type === 'terms' ? 'Regras da governança federada.' : 'Como protegemos a soberania e sustentabilidade dos dados.'} 
        icon={type === 'terms' ? FileText : Lock} 
      />
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium">
        <p>Este documento estabelece as diretrizes para uso da plataforma CUIDI no âmbito do Sistema Federado de Saúde.</p>
        <h3 className="text-xl font-bold text-slate-900 mt-8">1. Uso de Dados Assistenciais</h3>
        <p>O acesso a dados clínicos é permitido exclusivamente para finalidade de tratamento e cuidado assistencial, sob pena de sanções administrativas e penais, respeitando a governança federada.</p>
        <h3 className="text-xl font-bold text-slate-900 mt-8">2. Transparência ao Titular</h3>
        <p>O cidadão possui o direito de revogar qualquer consentimento a qualquer momento através da plataforma, com total rastreabilidade e auditoria.</p>
        <h3 className="text-xl font-bold text-slate-900 mt-8">3. Sustentabilidade e Conformidade</h3>
        <p>A CUIDI adota práticas de sustentabilidade institucional e conformidade com padrões internacionais de proteção de dados.</p>
      </div>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
});

export default TermsAndPrivacyScreen;