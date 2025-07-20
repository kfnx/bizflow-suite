import {
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';

export function SimplePageLoading(props: {
  children:
    | string
    | number
    | bigint
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | Promise<AwaitedReactNode>
    | null
    | undefined;
}) {
  return (
    <div className='flex h-full min-h-80 w-full items-center justify-center text-text-sub-600'>
      {props.children}
    </div>
  );
}
