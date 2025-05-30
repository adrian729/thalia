import { SVGProps } from 'react';

export function ArrowUpBold({
  title = 'Arrow Up',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          fill='currentColor'
          d='m3.165 19.503l7.362-16.51c.59-1.324 2.355-1.324 2.946 0l7.362 16.51c.667 1.495-.814 3.047-2.202 2.306l-5.904-3.152c-.459-.245-1-.245-1.458 0l-5.904 3.152c-1.388.74-2.87-.81-2.202-2.306'
        ></path>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
}

export function ArrowUpOutline({
  title = 'Arrow Up',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          fill='currentColor'
          fillRule='evenodd'
          d='M21.047 22.013c.654-.685.94-1.768.473-2.816l-7.363-16.51a2.338 2.338 0 0 0-4.315 0L2.48 19.197a2.55 2.55 0 0 0 .473 2.816c.659.69 1.735 1.009 2.767.458l-.353-.662l.353.662l5.904-3.152l-.354-.662l.354.662a.79.79 0 0 1 .752 0l5.904 3.152l.353-.662l-.353.662c1.032.55 2.108.232 2.767-.458m-2.06-.866l-.351.657zl-5.904-3.152a2.29 2.29 0 0 0-2.165 0l-5.903 3.152c-.356.19-.715.103-.976-.171a1.05 1.05 0 0 1-.188-1.169l7.362-16.51c.326-.73 1.25-.73 1.575 0l7.363 16.51c.2.448.08.889-.188 1.169c-.262.274-.62.36-.976.17'
          clipRule='evenodd'
        ></path>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
}

export const ReverbIcon = ({
  title = 'Triangular Wave',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 5.1)'>
          <path
            d='M8 12c-2 -3 -2 -7 0 -10'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M16 12c2 -3 2 -7 0 -10'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M4 14c-3 -4 -3 -10 0 -14'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M20 14c3 -4 3 -10 0 -14'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const MinusIcon = ({
  title = 'Minus Icon',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M5 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const NullIcon = ({
  title = 'Null Icon',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <circle
          cx='12'
          cy='12'
          r='6'
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
        />
        <path
          d='M18 6L6 18'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const PlusIcon = ({
  title = 'Plus Icon',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M12 5v14M5 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const DoublePlusIcon = ({
  title = 'Double Plus Icon',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M8 5v14M1 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M16 5v14M9 12h14'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const TriplePlusIcon = ({
  title = 'Triple Plus Icon',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 2)'>
          <path
            d='M12 4v4M10 6h4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M8 10v4M6 12h4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M16 10v4M14 12h4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const SineWaveIcon = ({
  title = 'Sine Wave',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <path
          d='M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0 4 6 6 0'
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const SquareWaveIcon = ({
  title = 'Square Wave',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 10)'>
          <path
            d='M2 4h4V-2h4v6h4V-2h4v6h4'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const SawtoothWaveIcon = ({
  title = 'Sawtooth Wave',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 12)'>
          <path
            d='M2 4l6 -8v8l6 -8v8l6 -8v8'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};

export const TriangularWaveIcon = ({
  title = 'Triangular Wave',
  ...props
}: { title?: string } & SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <title>{title}</title>
        <g transform='translate(0, 11)'>
          <path
            d='M2 4l6 -4l6 4l6 -4l6 4'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
      <span className='sr-only'>{title}</span>
    </>
  );
};
