// swift-tools-version: 6.3
import PackageDescription

let package = Package(
    name: "PerformanceBenchmarks",
    platforms: [.macOS(.v15)],
    dependencies: [
        // IMPORTANT: make sure to update version in package.json as well
        .package(url: "https://github.com/elementary-swift/elementary-ui", exact: "0.8.0"),
        .package(url: "https://github.com/swiftwasm/JavaScriptKit.git", from: "0.58.0"),
    ],
    targets: [
        .executableTarget(
            name: "App",
            dependencies: [
                .product(name: "ElementaryUI", package: "elementary-ui")
            ]
        )
    ],
    swiftLanguageModes: [.v5]
)
