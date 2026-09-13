# ☀️ HelioPool: Aquecimento Solar Inteligente e Óptica da Refração

Este projeto é uma plataforma web interativa e educacional que une dois conceitos fundamentais da física e engenharia sustentável: **o aquecimento solar de piscinas** e **os fenômenos ópticos da refração e dispersão da luz**.

O objetivo é demonstrar de forma didática como o comportamento da luz (refração, espectro solar e ângulos de incidência) pode **potencializar ou limitar** a eficiência térmica de um sistema de aquecimento solar.

---

## 🚀 Funcionalidades

1. **Calculadora de Eficiência Térmica**: Insira o CEP, área dos coletores, volume da piscina e temperaturas para calcular o tempo estimado de aquecimento com base em dados de radiação solar.
2. **Simulador da Lei de Snell**: Visualize em tempo real como o ângulo de incidência da luz solar muda ao penetrar na água (interface Canvas 2D interativa).
3. **Espectro Eletromagnético Interativo**: Barra de cores visuais (Vermelho ao Violeta) explicando a relação entre comprimento de onda, refração (Equação de Cauchy) e potencial de aquecimento (Infravermelho).
4. **Análise de Sinergia**: Seção dedicada a explicar como a reflexão de Fresnel e a dispersão afetam a captação de energia, com soluções de engenharia (ex: capas térmicas).
5. **Visualização 3D**: Renderização procedural via Three.js mostrando a piscina, o sol e os raios de luz incidindo sobre a superfície.

---

## 📂 Estrutura do Projeto

```text
├── index.html          # Estrutura principal e semântica do site
├── style.css           # Estilização responsiva e moderna (CSS3)
├── script.js           # Lógica de cálculo, simulador 2D e cena 3D (Three.js)
├── pool_model.obj      # Arquivo de geometria 3D (Wavefront)
├── pool_model.mtl      # Arquivo de materiais 3D correspondente
└── README.md           # Documentação do projeto
