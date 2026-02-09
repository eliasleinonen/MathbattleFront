import React from "react";
import { useNavigate } from 'react-router-dom';

export default function HowToDerivate() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          ← back
        </button>
        
        <div className="bg-white rounded-lg shadow p-8 text-gray-800">
          <h1 className="text-3xl font-bold mb-4">How to Derivate</h1>
          <p className="mb-8 text-gray-600">This page provides a quick reference and general knowledge for differentiation (derivation) in calculus.</p>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Rules</h2>
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-700 mb-1">Constant Rule</p>
                  <p className="text-sm text-gray-600">{'d/dx(c) = 0'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-700 mb-1">Power Rule</p>
                  <p className="text-sm text-gray-600">{'d/dx(x^n) = n·x^(n-1)'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-700 mb-1">Sum Rule</p>
                  <p className="text-sm text-gray-600">{"d/dx(f(x) + g(x)) = f'(x) + g'(x)"}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-700 mb-1">Difference Rule</p>
                  <p className="text-sm text-gray-600">{"d/dx(f(x) - g(x)) = f'(x) - g'(x)"}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-700 mb-1">Product Rule</p>
                  <p className="text-sm text-gray-600">{"d/dx(f(x)·g(x)) = f'(x)·g(x) + f(x)·g'(x)"}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-700 mb-1">Quotient Rule</p>
                  <p className="text-sm text-gray-600">{"d/dx(f(x)/g(x)) = [f'(x)·g(x) - f(x)·g'(x)] / [g(x)]^2"}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-700 mb-1">Chain Rule</p>
                  <p className="text-sm text-gray-600">{"d/dx(f(g(x))) = f'(g(x))·g'(x)"}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Common Derivatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(sin x) = cos x'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(cos x) = -sin x'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(tan x) = sec²x'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(ln x) = 1/x'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(e^x) = e^x'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(a^x) = a^x · ln a'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(arcsin x) = 1/√(1-x²)'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(arccos x) = -1/√(1-x²)'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{'d/dx(arctan x) = 1/(1+x²)'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">General Tips</h2>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Break down complex expressions using the sum, product, quotient, and chain rules</li>
                  <li>• Remember to simplify your answer where possible</li>
                  <li>• Practice with a variety of functions to get comfortable with the rules</li>
                </ul>
              </div>
            </div>
          </div>

        <p className="mt-8 text-gray-500 text-sm">For more, see your calculus textbook or <a href="https://en.wikipedia.org/wiki/Differentiation_rules" className="underline text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">Wikipedia: Differentiation rules</a>.</p>
        </div>
      </div>
    </div>
  );
}