type BookCoverImageProps = {
  src: string;
  alt: string;
};

export function BookCoverImage({ src, alt }: BookCoverImageProps) {
  return (
    <figure className="my-8 flex justify-center">
      <img
        src={src}
        alt={alt}
        className="max-h-[min(520px,70vh)] w-auto max-w-full rounded-lg border border-[var(--card-border)] shadow-[var(--shadow-card)]"
        loading="eager"
        decoding="async"
      />
    </figure>
  );
}
