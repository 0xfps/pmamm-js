export function getRandomShares(): number {
    return (Math.random() * 1_000_000_000) % 50_000_000
}