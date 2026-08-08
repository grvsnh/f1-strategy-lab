"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallbackMessage?: string;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-6 text-center my-4">
					<h4 className="text-lg font-bold text-red-400 mb-1">
						Something went wrong rendering this section
					</h4>
					<p className="text-xs text-zinc-400 font-mono">
						{this.state.error?.message || this.props.fallbackMessage || "An error occurred."}
					</p>
				</div>
			);
		}

		return this.props.children;
	}
}
