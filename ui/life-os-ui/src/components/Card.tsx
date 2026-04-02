import { type ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "primary";
};

function Card({ title, children, actions, variant = "default" }: CardProps) {
  const cardClassName = variant === "primary" ? "card primary" : "card";

  return (
    <section className={cardClassName}>
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        {actions}
      </div>
      <div className="card-content">{children}</div>
    </section>
  );
}

export default Card;
