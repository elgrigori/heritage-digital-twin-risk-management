import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				risk: {
					normal: 'hsl(var(--risk-normal) / <alpha-value>)',
					'normal-soft': 'hsl(var(--risk-normal-soft) / <alpha-value>)',
					medium: 'hsl(var(--risk-medium) / <alpha-value>)',
					'medium-soft': 'hsl(var(--risk-medium-soft) / <alpha-value>)',
					high: 'hsl(var(--risk-high) / <alpha-value>)',
					'high-soft': 'hsl(var(--risk-high-soft) / <alpha-value>)',
					critical: 'hsl(var(--risk-critical) / <alpha-value>)',
					'critical-soft': 'hsl(var(--risk-critical-soft) / <alpha-value>)'
				},
				onto: {
					crmdig: 'hsl(var(--onto-crmdig) / <alpha-value>)',
					'crmdig-soft': 'hsl(var(--onto-crmdig-soft) / <alpha-value>)',
					cidoc: 'hsl(var(--onto-cidoc) / <alpha-value>)',
					'cidoc-soft': 'hsl(var(--onto-cidoc-soft) / <alpha-value>)',
					rhdto: 'hsl(var(--onto-rhdto) / <alpha-value>)',
					'rhdto-soft': 'hsl(var(--onto-rhdto-soft) / <alpha-value>)'
				},
				ink: {
					panel: 'hsl(var(--ink-panel) / <alpha-value>)',
					'soft': 'hsl(var(--ink-panel-soft) / <alpha-value>)',
					foreground: 'hsl(var(--ink-panel-foreground) / <alpha-value>)',
					muted: 'hsl(var(--ink-panel-muted) / <alpha-value>)'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
				display: ['Literata', 'Georgia', 'Inter', 'ui-sans-serif', 'system-ui', 'serif'],
				mono: ['ui-monospace', 'SFMono-Regular', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace']
			},
			boxShadow: {
				elegant: 'var(--shadow-elegant)',
				glow: 'var(--shadow-glow)',
				float: 'var(--shadow-float)'
			},
			backgroundImage: {
				'hero-normal': 'radial-gradient(120% 120% at 100% 0%, hsl(var(--onto-crmdig)) 0%, hsl(var(--risk-normal)) 55%, hsl(190 60% 24%) 100%)',
				'hero-medium': 'radial-gradient(120% 120% at 100% 0%, hsl(var(--risk-high)) 0%, hsl(var(--risk-medium)) 60%, hsl(28 78% 34%) 100%)',
				'hero-high': 'radial-gradient(120% 120% at 100% 0%, hsl(var(--risk-critical)) 0%, hsl(var(--risk-high)) 60%, hsl(14 70% 34%) 100%)',
				'hero-critical': 'radial-gradient(120% 120% at 100% 0%, hsl(var(--onto-rhdto)) 0%, hsl(var(--risk-critical)) 55%, hsl(345 68% 32%) 100%)',
				'brand': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--onto-rhdto)) 100%)',
				'brand-soft': 'linear-gradient(135deg, hsl(var(--primary) / 0.14) 0%, hsl(var(--onto-rhdto) / 0.14) 100%)',
				'rail': 'linear-gradient(90deg, hsl(var(--onto-crmdig)) 0%, hsl(var(--primary)) 52%, hsl(var(--onto-rhdto)) 100%)',
				'edge-brand': 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--onto-rhdto)) 100%)',
				'edge-teal': 'linear-gradient(90deg, hsl(var(--onto-crmdig)) 0%, hsl(var(--onto-cidoc)) 100%)',
				'edge-amber': 'linear-gradient(90deg, hsl(var(--risk-medium)) 0%, hsl(var(--risk-high)) 100%)',
				'edge-rose': 'linear-gradient(90deg, hsl(var(--onto-rhdto)) 0%, hsl(var(--risk-critical)) 100%)',
				'edge-plain': 'linear-gradient(90deg, hsl(var(--border)) 0%, hsl(var(--border)) 100%)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-ring': {
					'0%': { boxShadow: '0 0 0 0 hsl(var(--risk-critical) / 0.45)' },
					'70%': { boxShadow: '0 0 0 14px hsl(var(--risk-critical) / 0)' },
					'100%': { boxShadow: '0 0 0 0 hsl(var(--risk-critical) / 0)' }
				},
				'soft-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.45' }
				},
				rise: {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'sheen': {
					from: { backgroundPosition: '200% 0' },
					to: { backgroundPosition: '-200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'soft-pulse': 'soft-pulse 1.6s ease-in-out infinite',
				rise: 'rise 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
				sheen: 'sheen 2.4s linear infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
