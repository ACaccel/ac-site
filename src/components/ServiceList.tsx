import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';
import ServiceCard from './ServiceCard';
import type { Service } from '../data/services';

export default function ServiceList({ services }: { services: Service[] }) {
  return (
    <ThemeRoot>
      {services.length > 0 ? (
        <CardGrid columns={2}>
          {services.map((service) => (
            <li key={service.path}>
              <ServiceCard service={service} detailed />
            </li>
          ))}
        </CardGrid>
      ) : (
        <EmptyState>目前沒有公開的服務。</EmptyState>
      )}
    </ThemeRoot>
  );
}
