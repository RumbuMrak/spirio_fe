import { cn } from '@/services/utils';
import React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import tailwindConfig from '../../tailwind.config';
import Logo from '@/components/UI/Logo';
import Button from '@/components/UI/button/Button';
import { GradientTitle, H1, H2, H3, H4 } from '@/components/UI/typography/Typography';
const fullConfig = resolveConfig(tailwindConfig as any);
const colors: any = fullConfig?.theme?.colors;
export default function Components() {
  return (
    <div className="mx-auto my-14 max-w-xl">
      <h1 className="mb-6 text-3xl">Components</h1>
      <Colors />
      <div className="mt-12 flex flex-col gap-12">
        <div>
          <H1 className="mb-4">
            H1: <span className="text-gradient">Hello World</span> from Pixelmate
          </H1>
          <H2 className="mb-4">
            H2: <span className="text-gradient">Hello World</span> from Pixelmate
          </H2>
          <H3 className="mb-4">
            H3: <span className="text-gradient">Hello World</span> from Pixelmate
          </H3>
          <H4 className="mb-4">
            H4: <span className="text-gradient">Hello World</span> from Pixelmate
          </H4>
          <GradientTitle className="mb-4">Gradient title</GradientTitle>
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-6">
          <Logo className="w-24" />
          <Logo className="w-56" />
          <Logo className="w-56 text-gray" color="primary" />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Button color="gradient">Gradient</Button>
          <Button color="gradient-dark">Gradient-dark</Button>
          <Button color="primary">Primary</Button>
          <Button color="transparent-white">Transparent-white</Button>
          <Button color="white">White</Button>
          <Button color="gradient" size="lg">
            Gradient LG
          </Button>
        </div>
        <p className="mb-6 rounded-xl p-12 bg-gradient">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium dolore tenetur alias molestias, eaque at, magni obcaecati officia magnam dolor
          qui? Consectetur voluptatum illum, ipsum eius quibusdam perspiciatis debitis eum.
        </p>
      </div>
    </div>
  );
}
const Colors = () => (
  <section id="colors">
    <h2 className="text-gray-900 mb-4 text-lg underline">Colors</h2>
    {Object.keys(colors).map((color) => {
      const shades =
        typeof colors[color] === 'string'
          ? [{ key: color, color: colors[color] }]
          : Object.keys(colors[color]).map((key) => ({ key, color: colors[color][key] }));
      return (
        <div key={color}>
          <div>
            <h5 className="text-sm leading-none">{color}</h5>
            <span className="text-gray-500 text-xs">{shades.length} colors</span>
          </div>
          <div className="my-4 grid grid-cols-5 gap-3">
            {shades.map((shade, index) => (
              <div
                key={color + shade.key + index}
                className={cn('flex aspect-square items-center justify-center rounded text-xs', {
                  'font-700 shadow-lg': shade.key === 'DEFAULT',
                })}
                style={{ backgroundColor: shade.color }}
              >
                <div className="flex flex-col items-center rounded bg-white/50 p-2">
                  {shade.key}
                  <span>{shade.color}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </section>
);
