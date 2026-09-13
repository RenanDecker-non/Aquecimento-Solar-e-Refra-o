document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CALCULADORA DE AQUECIMENTO SOLAR
    // ==========================================
    const cepInput = document.getElementById('cep');
    const radiacaoInput = document.getElementById('radiacao');
    const solarForm = document.getElementById('solarForm');

    // Simulação de banco de dados de radiação por CEP (exemplo simplificado)
    const radiacaoPorCEP = {
        '01001-000': 4.8, // São Paulo
        '20040-020': 5.2, // Rio de Janeiro
        '70040-010': 5.8, // Brasília
        '80010-000': 4.5, // Curitiba
        'default': 5.0
    };

    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value.trim();
        const radiacao = radiacaoPorCEP[cep] || radiacaoPorCEP['default'];
        radiacaoInput.value = radiacao;
    });

    solarForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const area = parseFloat(document.getElementById('area').value);
        const volume = parseFloat(document.getElementById('volume').value);
        const tempAmbiente = parseFloat(document.getElementById('tempAmbiente').value);
        const tempAlvo = parseFloat(document.getElementById('tempAlvo').value);
        const radiacao = parseFloat(radiacaoInput.value);

        if (tempAlvo <= tempAmbiente) {
            alert("A temperatura alvo deve ser maior que a temperatura ambiente.");
            return;
        }

        // Física: Q = m * c * ΔT
        // 1 Litro de água = 1 kg. c = 4186 J/(kg·°C)
        const deltaT = tempAlvo - tempAmbiente;
        const energiaNecessariaJoules = volume * 4186 * deltaT;
        const energiaNecessariaKWh = energiaNecessariaJoules / 3600000;

        // Energia captada por dia = Área * Radiação * Eficiência (60%)
        const eficiencia = 0.60;
        const energiaDiariaKWh = area * radiacao * eficiencia;

        const diasNecessarios = energiaNecessariaKWh / energiaDiariaKWh;

        document.getElementById('resEnergia').textContent = energiaNecessariaKWh.toFixed(2);
        document.getElementById('resDiaria').textContent = energiaDiariaKWh.toFixed(2);
        document.getElementById('resTempo').textContent = diasNecessarios.toFixed(1);
        
        document.getElementById('resultado').classList.remove('hidden');
    });

    // ==========================================
    // 2. SIMULADOR DA LEI DE SNELL (Canvas 2D)
    // ==========================================
    const angleSlider = document.getElementById('angleSlider');
    const angleValue = document.getElementById('angleValue');
    const refractedAngle = document.getElementById('refractedAngle');
    const canvas = document.getElementById('refractionCanvas');
    const ctx = canvas.getContext('2d');

    function drawRefraction() {
        const theta1 = parseFloat(angleSlider.value);
        angleValue.textContent = theta1;

        // n1 (ar) = 1.0003, n2 (água) = 1.333
        const n1 = 1.0003;
        const n2 = 1.333;

        // Lei de Snell: n1 * sin(theta1) = n2 * sin(theta2)
        const theta1Rad = theta1 * (Math.PI / 180);
        const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
        const theta2Rad = Math.asin(sinTheta2);
        const theta2 = theta2Rad * (180 / Math.PI);

        refractedAngle.textContent = theta2.toFixed(1);

        // Desenhar
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Linha de separação (superfície da água)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(canvas.width, cy);
        ctx.stroke();

        // Linha normal
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Raio incidente
        const rayLength = 100;
        const x1 = cx - rayLength * Math.sin(theta1Rad);
        const y1 = cy - rayLength * Math.cos(theta1Rad);
        
        ctx.strokeStyle = '#ffb700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Raio refratado
        const x2 = cx + rayLength * Math.sin(theta2Rad);
        const y2 = cy + rayLength * Math.cos(theta2Rad);
        
        ctx.strokeStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Textos
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText('Ar (n=1.0)', 10, 20);
        ctx.fillText('Água (n=1.33)', 10, canvas.height - 10);
    }

    angleSlider.addEventListener('input', drawRefraction);
    drawRefraction(); // Desenho inicial

    // ==========================================
    // 3. ESPECTRO ELETROMAGNÉTICO INTERATIVO
    // ==========================================
    const bands = document.querySelectorAll('.color-band');
    const spectrumInfo = document.getElementById('spectrumInfo');

    bands.forEach(band => {
        band.addEventListener('mouseenter', () => {
            const color = band.getAttribute('data-color');
            const wl = band.getAttribute('data-wl');
            const heat = band.getAttribute('data-heat');
            spectrumInfo.innerHTML = `<strong>${color}</strong> | Comprimento de onda: ${wl} | Potencial Térmico: ${heat}`;
        });
        band.addEventListener('mouseleave', () => {
            spectrumInfo.textContent = 'Passe o mouse sobre as cores para ver detalhes.';
        });
    });

    // ==========================================
    // 4. VISUALIZAÇÃO 3D (Three.js Procedural)
    // ==========================================
    const container3d = document.getElementById('canvas3d');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    const camera = new THREE.PerspectiveCamera(45, container3d.clientWidth / container3d.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container3d.clientWidth, container3d.clientHeight);
    container3d.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffb703, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Piscina (Base)
    const poolGeometry = new THREE.BoxGeometry(6, 1, 4);
    const poolMaterial = new THREE.MeshStandardMaterial({ color: 0x0077b6, transparent: true, opacity: 0.8 });
    const pool = new THREE.Mesh(poolGeometry, poolMaterial);
    pool.position.y = -0.5;
    scene.add(pool);

    // Borda da piscina
    const edgeGeometry = new THREE.EdgesGeometry(poolGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edges.position.y = -0.5;
    scene.add(edges);

    // Raios de luz (Cilindros finos)
    const rayGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const rayMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    for (let i = -2; i <= 2; i++) {
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.set(i, 3, 0);
        ray.rotation.z = Math.PI / 6; // Inclinação simulando refração
        scene.add(ray);
    }

    // Sol (Esfera)
    const sunGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffb703 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(5, 8, 5);
    scene.add(sun);

    function animate3D() {
        requestAnimationFrame(animate3D);
        controls.update();
        renderer.render(scene, camera);
    }
    animate3D();

    // Responsividade do Canvas 3D
    window.addEventListener('resize', () => {
        camera.aspect = container3d.clientWidth / container3d.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container3d.clientWidth, container3d.clientHeight);
    });
});
