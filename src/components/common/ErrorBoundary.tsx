import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Error Boundary досі реалізується лише класовим компонентом:
// перехоплює помилки відтворення дочірніх компонентів і показує запасний інтерфейс
// замість «білого екрана».
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Помилка відтворення:', error, info.componentStack);
  }

  render() {
    return this.state.hasError
      ? (this.props.fallback ?? (
          <div role="alert" className="py-16 text-center">
            <p className="text-lg font-semibold">Щось пішло не так.</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Оновіть сторінку або поверніться пізніше.
            </p>
          </div>
        ))
      : this.props.children;
  }
}
