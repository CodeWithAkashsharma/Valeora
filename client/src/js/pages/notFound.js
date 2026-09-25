import { state } from '../state.js';

export function renderNotFoundPage() {
  return `
    <div class="not-found-page-wrapper" style="
      min-height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 140px 24px 90px 24px;
      position: relative;
      background: linear-gradient(180deg, #240715 0%, #16030c 100%);
      text-align: center;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
    ">
      <div style="
        max-width: 540px;
        width: 100%;
        position: relative;
        z-index: 2;
        margin: 0 auto;
      ">
        <!-- Minimal Diamond Icon -->
        <div style="
          width: 56px;
          height: 56px;
          margin: 0 auto 18px auto;
          border-radius: 50%;
          background: rgba(138, 21, 56, 0.45);
          border: 1px solid rgba(214, 184, 190, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F7E7EB;
          box-shadow: 0 4px 16px rgba(138, 21, 56, 0.3);
        ">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="6 3 18 3 22 9 12 22 2 9"></polygon>
            <line x1="12" y1="22" x2="12" y2="9"></line>
            <line x1="2" y1="9" x2="22" y2="9"></line>
          </svg>
        </div>

        <!-- 404 Large Clean Serif Typography -->
        <div style="
          font-family: 'Cinzel', serif;
          font-size: clamp(5.5rem, 15vw, 9rem);
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1;
          background: linear-gradient(180deg, #FFFFFF 0%, #ECD8DC 60%, rgba(214, 184, 190, 0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
          text-shadow: 0 8px 24px rgba(0,0,0,0.25);
        ">
          404
        </div>

        <!-- Heading -->
        <h1 style="
          font-family: 'Cinzel', serif;
          font-size: clamp(1.4rem, 4vw, 2rem);
          color: #FFFFFF;
          margin-bottom: 14px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        ">
          Page Not Found
        </h1>

        <!-- Short & Crisp Subtext -->
        <p style="
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.02rem;
          line-height: 1.6;
          max-width: 440px;
          margin: 0 auto 36px auto;
        ">
          The page you are looking for doesn't exist or may have been moved.
        </p>

        <!-- Single Primary Action Button: Back to Home -->
        <div>
          <a href="/" data-route="home" style="
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 34px;
            border-radius: 99px;
            background: linear-gradient(135deg, #8A1538 0%, #680E28 100%);
            color: #FFFFFF;
            font-size: 0.96rem;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 0.03em;
            border: 1px solid rgba(214, 184, 190, 0.45);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 24px rgba(138, 21, 56, 0.45);
            cursor: pointer;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

export function bindNotFoundPageEvents() {
  // Bind any interactive events if needed
}
