import { ArrowRight, Radar } from 'lucide-react';
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading compact">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          {title}
          <span className="accent-dot">.</span>
        </h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
export function Empty({
  title,
  text,
  action,
  button,
}: {
  title: string;
  text: string;
  action: () => void;
  button: string;
}) {
  return (
    <div className="empty-state">
      <span>
        <Radar size={36} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary" onClick={action}>
        {button}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

export function BrandLogo() {
  return (
    <img
      className="brand-logo"
      src={import.meta.env.BASE_URL + 'logo-mi-negocio-web.png'}
      alt="MI NEGOCIO WEB"
      width={64}
      height={64}
    />
  );
}
