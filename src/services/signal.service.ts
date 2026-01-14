import { Injectable, signal, OnDestroy } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Signal } from '../models';

// The API key is expected to be available in the environment as process.env.API_KEY
declare const process: any;


@Injectable({
  providedIn: 'root',
})
export class SignalService implements OnDestroy {
  signals = signal<Signal[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  private ai: GoogleGenAI;
  private intervalId: any;

  constructor() {
    if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_API_KEY_HERE') {
      console.error("API Key for Google GenAI is not configured.");
      this.error.set("API Key not configured. Using mock data.");
      this.isLoading.set(false);
      this.useMockData();
      return;
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.startSignalGeneration();
  }

  private startSignalGeneration() {
    this.generateSignals();
    this.intervalId = setInterval(() => this.generateSignals(), 30000); // Fetch new signals every 30 seconds
  }

  async generateSignals() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const prompt = `
        Generate a list of 5 plausible binary options trading signals for the next few minutes.
        Follow these rules:
        - Assets should be common forex pairs like EUR/USD, GBP/USD, AUD/JPY, USD/CAD.
        - Timeframes should be either 'M1' or 'M5'.
        - Probabilities should be high, between 88 and 97.
        - Strategies should be one of: 'Trend Confluence', 'Extreme Zone Reversal', or 'Volatility Breakout'.
        - Do not add any commentary, just the JSON array.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                asset: { type: Type.STRING },
                type: { type: Type.STRING },
                timeframe: { type: Type.STRING },
                probability: { type: Type.NUMBER },
                strategy: { type: Type.STRING },
              },
            },
          },
        },
      });

      const newSignals = JSON.parse(response.text);
      this.signals.set(newSignals);

    } catch (e) {
      console.error('Error generating signals:', e);
      this.error.set('Failed to fetch signals from AI. Using mock data.');
      this.useMockData();
    } finally {
      this.isLoading.set(false);
    }
  }

  private useMockData() {
    const mockSignals: Signal[] = [
      { asset: 'EUR/USD', type: 'CALL', timeframe: 'M5', probability: 94, strategy: 'Trend Confluence' },
      { asset: 'GBP/JPY', type: 'PUT', timeframe: 'M1', probability: 91, strategy: 'Extreme Zone Reversal' },
      { asset: 'USD/CAD', type: 'CALL', timeframe: 'M1', probability: 89, strategy: 'Volatility Breakout' },
    ];
    this.signals.set(mockSignals);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}