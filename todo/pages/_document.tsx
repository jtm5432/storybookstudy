import Document, { DocumentContext, DocumentInitialProps } from "next/document";
import { ServerStyleSheet } from 'styled-components';
import React from 'react';


export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        // ServerStyleSheet 인스턴스를 생성합니다.
        const sheet = new ServerStyleSheet()

        // 원래 renderPage를 참조하여 보관합니다.
        const originalRenderPage = ctx.renderPage;

        try {
            // styled-components의 collectStyles로 원래 renderPage를 감쌉니다.
            ctx.renderPage = () => 
            originalRenderPage({
                enhanceApp: (App) => (props) =>
                sheet.collectStyles(<App {...props} />),
            })

            // 초기 props를 가져옵니다.
            const initialProps = await Document.getInitialProps(ctx);

            return {
                ...initialProps,
                // 초기 스타일과 styled-components에서 생성된 스타일을 결합합니다.
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                                    ),
            }
        } finally {
            // 더 이상 스타일을 추가할 수 없도록 ServerStyleSheet를 봉인합니다.
            sheet.seal();
        }
    }
}
