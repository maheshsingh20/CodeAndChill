import React, { useEffect, useRef } from 'react';

interface CodedBackground3DProps {
  className?: string;
}

export const CodedBackground3D: React.FC<CodedBackground3DProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Coding symbols and elements
    const codeSymbols = [
      '{ }', '< >', '[ ]', '( )', '=>', '&&', '||', '++', '--', '===', '!==',
      'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return',
      'class', 'import', 'export', 'async', 'await', 'try', 'catch', 'finally',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'
    ];

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      symbol: string;
      size: number;
      opacity: number;
      color: string;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
      rotationSpeedX: number;
      rotationSpeedY: number;
      rotationSpeedZ: number;
    }> = [];

    // Color palette for coding theme
    const colors = [
      '#60A5FA', // Blue
      '#34D399', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#EC4899', // Pink
    ];

    // Initialize particles
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 2,
        symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        rotationSpeedZ: (Math.random() - 0.5) * 0.02,
      });
    }

    // Floating code blocks
    const codeBlocks: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      width: number;
      height: number;
      opacity: number;
      rotationY: number;
      rotationSpeed: number;
    }> = [];

    // Initialize code blocks
    const blockCount = 12;
    for (let i = 0; i < blockCount; i++) {
      codeBlocks.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 1,
        width: Math.random() * 100 + 80,
        height: Math.random() * 60 + 40,
        opacity: Math.random() * 0.3 + 0.1,
        rotationY: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw code blocks (3D rectangles)
      codeBlocks.forEach((block) => {
        // Update position
        block.x += block.vx;
        block.y += block.vy;
        block.z += block.vz;
        block.rotationY += block.rotationSpeed;

        // Wrap around screen
        if (block.x < -block.width) block.x = canvas.offsetWidth + block.width;
        if (block.x > canvas.offsetWidth + block.width) block.x = -block.width;
        if (block.y < -block.height) block.y = canvas.offsetHeight + block.height;
        if (block.y > canvas.offsetHeight + block.height) block.y = -block.height;
        if (block.z < -500) block.z = 1000;
        if (block.z > 1000) block.z = -500;

        // 3D perspective calculation
        const perspective = 800;
        const scale = perspective / (perspective + block.z);
        const projectedX = block.x * scale;
        const projectedY = block.y * scale;
        const projectedWidth = block.width * scale;
        const projectedHeight = block.height * scale;

        // Draw 3D code block
        ctx.save();
        ctx.translate(projectedX + projectedWidth / 2, projectedY + projectedHeight / 2);

        // Apply 3D rotation effect
        const skewX = Math.sin(block.rotationY) * 0.3;
        ctx.transform(1, 0, skewX, 1, 0, 0);

        ctx.globalAlpha = block.opacity * scale;

        // Draw block shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(-projectedWidth / 2 + 3, -projectedHeight / 2 + 3, projectedWidth, projectedHeight);

        // Draw main block
        const gradient = ctx.createLinearGradient(-projectedWidth / 2, -projectedHeight / 2, projectedWidth / 2, projectedHeight / 2);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(-projectedWidth / 2, -projectedHeight / 2, projectedWidth, projectedHeight);

        // Draw block border
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-projectedWidth / 2, -projectedHeight / 2, projectedWidth, projectedHeight);

        ctx.restore();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Update rotation
        particle.rotationX += particle.rotationSpeedX;
        particle.rotationY += particle.rotationSpeedY;
        particle.rotationZ += particle.rotationSpeedZ;

        // Wrap around screen
        if (particle.x < -50) particle.x = canvas.offsetWidth + 50;
        if (particle.x > canvas.offsetWidth + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.offsetHeight + 50;
        if (particle.y > canvas.offsetHeight + 50) particle.y = -50;
        if (particle.z < -500) particle.z = 1000;
        if (particle.z > 1000) particle.z = -500;

        // 3D perspective calculation
        const perspective = 800;
        const scale = perspective / (perspective + particle.z);
        const projectedX = particle.x * scale;
        const projectedY = particle.y * scale;
        const projectedSize = particle.size * scale;

        // Draw particle with 3D effect
        ctx.save();
        ctx.translate(projectedX, projectedY);

        // Apply 3D rotation
        const rotationEffect = Math.sin(particle.rotationY) * 0.5 + 0.5;
        ctx.scale(rotationEffect, 1);

        ctx.globalAlpha = particle.opacity * scale;
        ctx.fillStyle = particle.color;
        ctx.font = `${projectedSize}px 'Fira Code', 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10 * scale;
        ctx.fillText(particle.symbol, 0, 0);

        ctx.restore();
      });

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dz = particles[i].z - particles[j].z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 150) {
            const perspective = 800;
            const scale1 = perspective / (perspective + particles[i].z);
            const scale2 = perspective / (perspective + particles[j].z);

            ctx.globalAlpha = (1 - distance / 150) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x * scale1, particles[i].y * scale1);
            ctx.lineTo(particles[j].x * scale2, particles[j].y * scale2);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(17, 24, 39, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%)',
        zIndex: -1
      }}
    />
  );
};