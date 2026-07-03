const pt = {
  nav: {
    docs: "Docs",
    install: "Instalar",
    github: "GitHub",
    why: "Por que",
  },
  hero: {
    eyebrow: "Parity-Driven Development",
    headline: "Prove que sua migração não quebrou nada.",
    cta: "Ver o pipeline",
  },
  problem: {
    title: "\"O sistema novo ainda se comporta como o antigo?\"",
    body: "Essa pergunta costuma ser respondida no feeling. O PDD transforma isso em evidência objetiva e rastreada — cada comportamento do sistema de referência vira uma finding que você pode investigar, corrigir, provar e aprovar em QA antes de chegar na main.",
  },
  pipeline: {
    bootstrap: {
      tag: "00 · configuração única",
      description:
        "Uma entrevista estruturada captura o contexto operacional que todo outro comando depende — sistema de referência, ambientes de QA, limiares de confiança. Toda resposta é absorvida no BOOTSTRAP.md.",
      why: "Roda uma vez por projeto. Nada mais funciona sem isso — todo outro comando /audit-* lê esse arquivo antes de fazer qualquer coisa.",
    },
    new: {
      tag: "01 · abrir uma finding",
      description:
        "Você descreve um comportamento suspeito. O PDD abre a finding #007, calcula uma confidence tier inicial e adiciona uma entrada no coverage map.",
      why: "Isso força um fato observável, não uma reclamação vaga — 'mostra 3 itens, deveria mostrar 5' é aceito, 'está quebrado' é rejeitado.",
    },
    investigate: {
      tag: "02 · causa raiz",
      description: "Investigação somente-leitura do sistema de referência. Nada é alterado — só entendido.",
      why: "Separar 'entender' de 'corrigir' evita que um patch apressado esconda a causa real.",
    },
    resolve: {
      tag: "03 · corrigir",
      description: "Fix mais um teste de caracterização obrigatório. Cria a branch audit/007. Não commita sozinho.",
      why: "O teste fixa o comportamento de referência permanentemente — ele falha se alguém regredir essa correção depois.",
    },
    compare: {
      tag: "04 · prova objetiva",
      description: "Golden-master harness: roda a mesma operação nos dois sistemas e produz um diff objetivo dado-a-dado.",
      why: "Essa é evidência tier-2 — um diff verificado por máquina, não um print que alguém olhou e aprovou.",
    },
    "qa-local": {
      tag: "05 · gate humano #1",
      description: "QA no localhost, antes do PR. Essa aprovação é uma pré-condição bloqueante pro /audit-pr.",
      why: "Um humano — não a IA — decide se a correção realmente está certa antes de qualquer PR ser aberto.",
    },
    pr: {
      tag: "06 · dossiê de evidências",
      description: "Monta o PR como um dossiê de evidências. Só faz push e abre o PR depois de um 'sim' humano explícito na mesma sessão.",
      why: "A regra inviolável: a IA nunca autora commits, e o push só acontece depois de um 'sim' humano explícito.",
    },
    "qa-env": {
      tag: "07 · gate humano #2",
      description: "QA no ambiente já deployado, depois do PR. Registra qa-<env> por ambiente.",
      why: "QA no localhost e um deploy real de staging podem discordar — isso pega o que só aparece quando está no ar.",
    },
    merge: {
      tag: "08 · 100% humano",
      description: "A IA nunca autora commits. O merge é feito só por um humano — e é aí que a coverage vira 'verified' de verdade.",
      why: "Coverage só vira 'verified' quando o QA do ambiente-alvo é aprovado E o PR é mergeado — nunca só pela resolução local.",
    },
  },
  principles: {
    title: "Oito princípios, um único método.",
    body: "O PDD não é um feeling — todo comando existe pra reforçar um destes.",
    items: [
      "Disciplina forçada / gates",
      "Estado externalizado em arquivos — o .audit/ é a fonte da verdade, não o contexto do modelo",
      "Comandos pequenos e composáveis",
      "Evidência objetiva acima de opinião",
      "Um humano no gate de toda ação irreversível",
      "Feedback rápido e observável",
      "Comandos idempotentes e cientes do estado",
      "Revelação progressiva — o próprio ciclo ensina",
    ],
  },
  tiers: {
    title: "Evidência tem uma nota.",
    body: "Toda finding carrega uma confidence tier descrevendo a qualidade da sua prova — e o PDD se recusa a fechar uma finding abaixo da tier exigida pelo seu projeto.",
    rows: [
      { tier: "tier-0", evidence: "só descrição textual", label: "baixa" },
      { tier: "tier-1", evidence: "screenshots pareados (referência vs novo)", label: "média" },
      { tier: "tier-2", evidence: "diff automático de dados", label: "alta" },
      { tier: "tier-3", evidence: "tier-2 mais um teste de caracterização passando", label: "máxima" },
    ],
  },
  coverageClose: {
    title: "Cobertura de paridade, rastreada até o último percentual.",
    cta: "Instalar o PDD",
  },
  footer: {
    tagline: "Um framework pra refactor, rewrite e port confiável de sistemas legados — com paridade comportamental rastreada.",
    rights: "Todos os direitos reservados.",
    siteLabel: "Site",
    connectLabel: "Conecte-se",
  },
};

export default pt;
