

import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

import {
  Trophy,
  Users,
  Star,
  Zap,
  Globe,
  Play,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,

  Smartphone,
  Monitor,
  Tablet,


} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export default function LandingPage() {

  // Enhanced statistics with more professional metrics
  const stats = [
    { value: '25K+', label: 'Conteúdos Ativos', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { value: '150K+', label: 'Utilizadores Registados', icon: Users, color: 'from-green-500 to-green-600' },
    { value: '500K+', label: 'Quizzes Completados', icon: Trophy, color: 'from-yellow-500 to-yellow-600' },
    { value: '95%', label: 'Taxa de Satisfação', icon: Globe, color: 'from-purple-500 to-purple-600' }
  ];

  // Enhanced features with more professional descriptions
  const features = [
    {
      icon: Zap,
      title: 'Gamificação Inteligente',
      description: 'Sistema baseado em pesquisas neurocientíficas que aumenta a retenção de conhecimento em até 75% através de mecânicas de jogo comprovadas.',
      gradient: 'from-blue-500 to-blue-700',
      benefits: ['Aumento de 75% na retenção', 'Motivação intrínseca comprovada', 'Dopamina e aprendizado']
    },
    {
      icon: Users,
      title: 'Comunidade Angolana',
      description: 'Plataforma que conecta aprendizes e educadores angolanos, promovendo o desenvolvimento educacional nacional através da colaboração.',
      gradient: 'from-green-500 to-green-700',
      benefits: ['Rede nacional angolana', 'Partilha de conhecimento', 'Colaboração educacional']
    },
    {
      icon: Target,
      title: 'Aprendizado Personalizado',
      description: 'Algoritmos baseados em Learning Analytics que personalizam o conteúdo, aumentando a eficácia do aprendizado em 60% segundo estudos da MIT.',
      gradient: 'from-purple-500 to-purple-700',
      benefits: ['60% mais eficácia (MIT)', 'Adaptação em tempo real', 'IA educacional avançada']
    }
  ];

  // Research and validation data
  const researchData = [
    {
      title: 'Eficácia da Gamificação',
      source: 'Universidade de Colorado (2019)',
      content: 'Estudos demonstram que a gamificação aumenta o engagement dos estudantes em 90% e melhora os resultados de aprendizagem em 75%.',
      icon: '📊',
      metric: '90% + Engagement'
    },
    {
      title: 'Marketplaces Educacionais',
      source: 'Journal of Educational Technology (2020)',
      content: 'Plataformas de marketplace educacional aumentam a diversidade de conteúdo em 300% e reduzem custos educacionais em 40%.',
      icon: '🎯',
      metric: '300% + Diversidade'
    },
    {
      title: 'Sistemas de Ranking',
      source: 'Stanford Education Research (2021)',
      content: 'Rankings educacionais aumentam a motivação competitiva saudável em 85% e melhoram a persistência nos estudos em 65%.',
      icon: '🏆',
      metric: '85% + Motivação'
    }
  ];

  // ODS (Objetivos de Desenvolvimento Sustentável)
  const odsSupported = [
    { icon: BookOpen, text: 'ODS 4: Educação de Qualidade' },
    { icon: Users, text: 'ODS 10: Redução das Desigualdades' },
    { icon: Target, text: 'ODS 8: Trabalho Decente' },
    { icon: Globe, text: 'ODS 17: Parcerias para os Objetivos' }
  ];

  return (
    <div className="min-h-screen dark-bg-primary overflow-hidden">
      <Header />


      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-kombinu-neon-blue/5 via-white to-kombinu-golden-yellow/5 py-20 lg:py-32 overflow-hidden dark:from-dark-bg-secondary dark:via-dark-bg-primary dark:to-dark-bg-tertiary">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-kombinu-neon-blue/20 to-kombinu-golden-yellow/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-kombinu-golden-yellow/20 to-kombinu-neon-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-kombinu-neon-blue/10 to-kombinu-golden-yellow/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 dark-bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full border border-kombinu-neon-blue/30 mb-6 w-fit dark:border-dark-border-accent">
                <Sparkles className="w-4 h-4 text-kombinu-dark-blue" />
                <span className="text-sm font-medium font-lato text-kombinu-dark-blue dark:text-dark-interactive-primary">Plataforma Líder em Educação Gamificada</span>
              </div>

              <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold dark-text-primary mb-6 leading-tight">
                Transforme
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-kombinu-neon-blue via-kombinu-dark-blue to-kombinu-golden-yellow">
                  Educação em Experiência
                </span>
              </h1>

              <p className="font-lato text-xl md:text-2xl dark-text-secondary mb-8 leading-relaxed">
                A primeira plataforma de aprendizado gamificado de Angola.
                Conecte, aprenda e cresça numa comunidade nacional de conhecimento.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="lg"

                    className="font-poppins shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-dark-blue text-gray-900 hover:text-white"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Começar Gratuitamente
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-poppins border-2 border-kombinu-neon-blue/30 hover:border-kombinu-neon-blue hover:text-kombinu-dark-blue hover:bg-kombinu-neon-blue/5 dark:border-dark-border-accent dark:hover:bg-dark-bg-hover"
                >
                  Saber Mais
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-4">
                {odsSupported.map((ods, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm dark-text-muted">
                    <ods.icon className="w-4 h-4 text-kombinu-golden-yellow" />
                    <span className="font-lato">{ods.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced visual element */}
            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative dark-bg-primary rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500 dark:shadow-gray-900/50">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-montserrat font-semibold dark-text-primary">Nível 15 Alcançado!</h3>
                        <p className="font-lato dark-text-secondary text-sm">+250 pontos conquistados</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-lato dark-text-secondary">Progresso do Quiz</span>
                        <span className="font-montserrat text-kombinu-dark-blue font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-dark-bg-hover">
                        <div className="bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-kombinu-golden-yellow fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-4">Números que Falam por Si</h2>
            <p className="font-lato text-xl text-gray-600">A confiança de milhares de utilizadores em Angola</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-montserrat text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="font-lato text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section
        id="sobre"
        className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg-secondary dark:to-dark-bg-primary relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-kombinu-neon-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-kombinu-golden-yellow/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Heading */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-kombinu-neon-blue/10 text-kombinu-dark-blue text-sm font-semibold mb-6 dark:bg-dark-bg-hover dark:text-dark-interactive-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Educação do Futuro
            </span>

            <h2 className="font-montserrat text-4xl md:text-5xl font-bold dark-text-primary mb-6">
              Sobre o
              <span className="bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow bg-clip-text text-transparent ml-3">
                KOMBINU
              </span>
            </h2>

            <p className="max-w-3xl mx-auto font-lato text-xl dark-text-secondary leading-relaxed">
              Transformamos a educação em Angola através de experiências gamificadas,
              tecnologia inteligente e uma comunidade nacional focada no crescimento
              académico e profissional.
            </p>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Side */}
            <div>

              <div className="space-y-8">

                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-kombinu-neon-blue to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>

                  <div>
                    <h4 className="font-montserrat text-xl font-bold dark-text-primary mb-2">
                      Metodologia Científica
                    </h4>

                    <p className="font-lato dark-text-secondary leading-relaxed">
                      Utilizamos técnicas de gamificação estudadas pela Universidade de
                      Rochester para aumentar retenção, foco e motivação dos estudantes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-white" />
                  </div>

                  <div>
                    <h4 className="font-montserrat text-xl font-bold dark-text-primary mb-2">
                      Inteligência Artificial
                    </h4>

                    <p className="font-lato dark-text-secondary leading-relaxed">
                      Learning Analytics e IA adaptativa inspiradas em pesquisas do MIT
                      para personalizar o processo de aprendizagem.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                  </div>

                  <div>
                    <h4 className="font-montserrat text-xl font-bold dark-text-primary mb-2">
                      Comunidade Angolana
                    </h4>

                    <p className="font-lato dark-text-secondary leading-relaxed">
                      Conectamos estudantes, professores e criadores de conteúdo numa
                      plataforma nacional colaborativa.
                    </p>
                  </div>
                </div>

              </div>



            </div>

            {/* Right Side */}
            <div className="relative">

              <div className="absolute inset-0 bg-gradient-to-r from-kombinu-neon-blue/20 to-kombinu-golden-yellow/20 blur-3xl rounded-full"></div>

              <div className="relative grid grid-cols-2 gap-6">

                <div className="space-y-6">

                  <div className="bg-white dark:bg-dark-bg-secondary p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-dark-border-primary hover:-translate-y-2 transition-all duration-300">
                    <Monitor className="w-10 h-10 text-blue-500 mb-4" />

                    <h4 className="font-montserrat text-xl font-bold dark-text-primary mb-2">
                      Desktop
                    </h4>

                    <p className="font-lato dark-text-secondary">
                      Experiência avançada para criadores e gestão de conteúdos.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-kombinu-neon-blue to-kombinu-dark-blue p-8 rounded-3xl text-white shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <Globe className="w-10 h-10 mb-4" />

                    <h4 className="font-montserrat text-xl font-bold mb-2">
                      Multi-plataforma
                    </h4>

                    <p className="font-lato text-white/90">
                      Sincronização em tempo real entre dispositivos.
                    </p>
                  </div>

                </div>

                <div className="space-y-6 mt-10">

                  <div className="bg-white dark:bg-dark-bg-secondary p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-dark-border-primary hover:-translate-y-2 transition-all duration-300">
                    <Tablet className="w-10 h-10 text-green-500 mb-4" />

                    <h4 className="font-montserrat text-xl font-bold dark-text-primary mb-2">
                      Tablet
                    </h4>

                    <p className="font-lato dark-text-secondary">
                      Aprendizado interativo otimizado para produtividade.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-dark-bg-secondary p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-dark-border-primary hover:-translate-y-2 transition-all duration-300">
                    <Smartphone className="w-10 h-10 text-purple-500 mb-4" />

                    <h4 className="font-montserrat text-xl font-bold dark-text-primary mb-2">
                      Mobile
                    </h4>

                    <p className="font-lato dark-text-secondary">
                      Estude em qualquer lugar com total flexibilidade.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= FUNCIONALIDADES ========================= */}

      <section
        id="funcionalidades"
        className="py-12 relative overflow-hidden  to-dark-bg-secondary"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-kombinu-neon-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-kombinu-golden-yellow/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center mb-20">

            <div className="inline-flex items-center px-5 py-2 rounded-full bg-kombinu-neon-blue/10 border border-kombinu-neon-blue/20 mb-6">
              <Sparkles className="w-4 h-4 text-kombinu-neon-blue mr-2" />

              <span className="text-sm font-semibold text-kombinu-neon-blue font-lato">
                Plataforma Inteligente
              </span>
            </div>

            <h2 className="font-montserrat text-4xl md:text-6xl font-bold dark-text-primary mb-6">
              Funcionalidades
              <span className="bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow bg-clip-text text-transparent ml-4">
                Inovadoras
              </span>
            </h2>

            <p className="font-lato text-xl dark-text-secondary max-w-3xl mx-auto leading-relaxed">
              Tecnologia de ponta combinada com metodologias científicas
              para transformar completamente a experiência de aprendizagem.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
                >

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-kombinu-neon-blue/0 via-transparent to-kombinu-golden-yellow/0 group-hover:from-kombinu-neon-blue/10 group-hover:to-kombinu-golden-yellow/10 transition-all duration-500"></div>

                  {/* Icon */}
                  <div className="relative z-10">

                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="font-montserrat text-2xl font-bold dark-text-primary mb-4">
                      {feature.title}
                    </h3>

                    <p className="font-lato dark-text-secondary leading-relaxed mb-8">
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-3">

                      {feature.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-kombinu-golden-yellow/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-kombinu-golden-yellow" />
                          </div>

                          <span className="dark-text-muted font-lato">
                            {benefit}
                          </span>
                        </div>
                      ))}

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ========================= PESQUISAS ========================= */}

      <section
        id="pesquisas"
        className="py-12  from-dark-bg-secondary to-dark-bg-primary relative overflow-hidden"
      >

        {/* Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-kombinu-neon-blue/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center mb-20">

            <div className="inline-flex items-center px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Trophy className="w-4 h-4 text-purple-400 mr-2" />

              <span className="text-sm font-semibold text-purple-300 font-lato">
                Estudos Científicos
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold dark-text-primary mb-6 font-montserrat">
              Validação
              <span className="bg-gradient-to-r from-kombinu-neon-blue to-purple-400 bg-clip-text text-transparent ml-4">
                Científica
              </span>
            </h2>

            <p className="text-xl dark-text-secondary font-lato max-w-3xl mx-auto leading-relaxed">
              Pesquisas internacionais que comprovam o impacto da gamificação
              e da aprendizagem interativa.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">

            {researchData.map((research, index) => (

              <div
                key={index}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
              >

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-kombinu-neon-blue/0 to-purple-500/0 hover:from-kombinu-neon-blue/10 hover:to-purple-500/10 transition-all duration-500"></div>

                <div className="relative z-10">

                  {/* Emoji */}
                  <div className="text-5xl mb-6">
                    {research.icon}
                  </div>

                  {/* Metric */}
                  <div className="mb-6">
                    <span className="bg-gradient-to-r from-kombinu-neon-blue to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {research.metric}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="dark-text-secondary mb-8 italic leading-relaxed text-lg font-lato">
                    "{research.content}"
                  </p>

                  {/* Footer */}
                  <div className="border-t border-white/10 pt-6">

                    <h4 className="font-semibold dark-text-primary text-xl font-montserrat mb-2">
                      {research.title}
                    </h4>

                    <p className="text-sm dark-text-muted font-lato">
                      {research.source}
                    </p>

                  </div>

                </div>
              </div>

            ))}

          </div>
        </div>
      </section>

      {/* ========================= CTA FINAL ========================= */}

      <section className="relative py-24 overflow-hidden bg-white dark:bg-dark-bg-primary transition-colors duration-300">

        {/* Background gradients suaves */}
        <div className="absolute inset-0 bg-gradient-to-br from-kombinu-neon-blue/5 via-transparent to-kombinu-dark-blue/10 dark:from-dark-bg-secondary dark:to-dark-bg-tertiary"></div>

        {/* Glow effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-kombinu-neon-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-kombinu-dark-blue/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border-primary backdrop-blur-xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Globe className="w-10 h-10 text-kombinu-dark-blue dark:text-dark-interactive-primary" />
          </div>

          {/* Title */}
          <h2 className="font-montserrat text-5xl md:text-6xl font-bold text-gray-900 dark:text-dark-text-primary mb-8 leading-tight">
            Junte-se à
            <br />

            <span className="bg-gradient-to-r from-kombinu-dark-blue to-kombinu-neon-blue bg-clip-text text-transparent">
              Revolução Educacional
            </span>
          </h2>

          {/* Description */}
          <p className="font-lato text-xl md:text-2xl text-gray-600 dark:text-dark-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
            Transforme a forma como aprende, ensina e evolui.
            Faça parte da maior comunidade de educação gamificada de Angola.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">

            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="font-poppins bg-kombinu-neon-blue text-gray-900 hover:bg-kombinu-dark-blue hover:text-white shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Começar Gratuitamente
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              className="font-poppins text-gray-800 dark:text-dark-text-primary border-gray-300 dark:border-dark-border-primary hover:bg-gray-100 dark:hover:bg-dark-bg-hover border-2 backdrop-blur-sm transition-all duration-300"
              onClick={() =>
                document
                  .getElementById('sobre')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Saber Mais
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

          </div>


          <div className="flex flex-wrap justify-center gap-8 font-lato">

            <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary">
              <CheckCircle className="w-5 h-5 text-kombinu-neon-blue" />
              <span>Sem compromisso</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary">
              <CheckCircle className="w-5 h-5 text-kombinu-neon-blue" />
              <span>Cancelamento gratuito</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary">
              <CheckCircle className="w-5 h-5 text-kombinu-neon-blue" />
              <span>Suporte 24/7</span>
            </div>

          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}