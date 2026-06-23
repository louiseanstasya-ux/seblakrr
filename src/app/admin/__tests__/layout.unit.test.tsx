/**
 * Unit tests for AdminLayout sidebar toggle feature
 * Feature: admin-sidebar-toggle
 * Requirements: 1.1, 1.4, 1.5, 2.2, 2.4, 3.3, 3.4, 4.4, 7.4
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminLayout from '../layout';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/admin'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock @radix-ui/react-tooltip to avoid portal/pointer issues in jsdom
vi.mock('@radix-ui/react-tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? <>{children}</> : <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

const renderLayout = () =>
  render(<AdminLayout><div>Test Children</div></AdminLayout>);

describe('AdminLayout sidebar toggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initial render: sidebar has w-64 class (expanded)', () => {
    renderLayout();
    const aside = document.querySelector('aside');
    expect(aside).toHaveClass('w-64');
    expect(aside).not.toHaveClass('w-16');
  });

  it('initial render: toggle button shows PanelLeftClose icon (aria-label = Tutup sidebar)', () => {
    renderLayout();
    const btn = screen.getByRole('button', { name: /tutup sidebar/i });
    expect(btn).toBeInTheDocument();
  });

  it('click toggle once: sidebar changes to w-16 (collapsed)', () => {
    renderLayout();
    const btn = screen.getByRole('button', { name: /tutup sidebar/i });
    fireEvent.click(btn);
    const aside = document.querySelector('aside');
    expect(aside).toHaveClass('w-16');
    expect(aside).not.toHaveClass('w-64');
  });

  it('click toggle once: button aria-label changes to Buka sidebar', () => {
    renderLayout();
    const btn = screen.getByRole('button', { name: /tutup sidebar/i });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /buka sidebar/i })).toBeInTheDocument();
  });

  it('click toggle twice: sidebar returns to w-64 (expanded)', () => {
    renderLayout();
    const btn = screen.getByRole('button', { name: /tutup sidebar/i });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole('button', { name: /buka sidebar/i }));
    const aside = document.querySelector('aside');
    expect(aside).toHaveClass('w-64');
  });

  it('toggle button appears before page title in the DOM', () => {
    renderLayout();
    const btn = screen.getByRole('button', { name: /tutup sidebar/i });
    const title = screen.getByText('Panel Admin');
    // button should come before title text in DOM order
    expect(btn.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('expanded: "SeblakRR" and "Admin Panel" are visible', () => {
    renderLayout();
    expect(screen.getByText('SeblakRR')).toBeInTheDocument();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('collapsed: "SeblakRR" and "Admin Panel" are not in the DOM', () => {
    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: /tutup sidebar/i }));
    expect(screen.queryByText('SeblakRR')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('expanded: footer link "Lihat Halaman User" and copyright text are visible', () => {
    renderLayout();
    expect(screen.getByText('Lihat Halaman User')).toBeInTheDocument();
    expect(screen.getByText(/Seblak RR © 2025/)).toBeInTheDocument();
  });

  it('collapsed: footer link and copyright are not in the DOM', () => {
    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: /tutup sidebar/i }));
    expect(screen.queryByText('Lihat Halaman User')).not.toBeInTheDocument();
    expect(screen.queryByText(/Seblak RR © 2025/)).not.toBeInTheDocument();
  });

  it('Top Bar has sticky and top-0 classes', () => {
    renderLayout();
    // The top bar div wraps "Panel Admin" text
    const panelAdmin = screen.getByText('Panel Admin');
    const topBar = panelAdmin.closest('.sticky');
    expect(topBar).toBeInTheDocument();
    expect(topBar).toHaveClass('sticky', 'top-0');
  });

  it('sidebar <aside> has transition-all class', () => {
    renderLayout();
    const aside = document.querySelector('aside');
    expect(aside).toHaveClass('transition-all');
  });

  it('"Simulasi Aktif" badge is always visible', () => {
    renderLayout();
    expect(screen.getByText('Simulasi Aktif')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /tutup sidebar/i }));
    expect(screen.getByText('Simulasi Aktif')).toBeInTheDocument();
  });

  it('logo "SR" is always visible regardless of sidebar state', () => {
    renderLayout();
    expect(screen.getByText('SR')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /tutup sidebar/i }));
    expect(screen.getByText('SR')).toBeInTheDocument();
  });

  it('children are always rendered', () => {
    renderLayout();
    expect(screen.getByText('Test Children')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /tutup sidebar/i }));
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('3 nav links are always present', () => {
    renderLayout();
    const navLinks = document.querySelectorAll('nav a');
    expect(navLinks.length).toBe(3);
    fireEvent.click(screen.getByRole('button', { name: /tutup sidebar/i }));
    expect(document.querySelectorAll('nav a').length).toBe(3);
  });

  it('active nav item has bg-orange-600 class when pathname matches', () => {
    renderLayout(); // usePathname mocked to '/admin'
    const dashboardLink = document.querySelector('nav a[href="/admin"]');
    expect(dashboardLink).toHaveClass('bg-orange-600');
  });

  it('active nav item retains bg-orange-600 when sidebar is collapsed', () => {
    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: /tutup sidebar/i }));
    const dashboardLink = document.querySelector('nav a[href="/admin"]');
    expect(dashboardLink).toHaveClass('bg-orange-600');
  });
});
